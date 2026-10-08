import sys
import time
import uuid
import threading
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

# Add project root directory to sys.path to import scanner.py
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import scanner
from app.history_service import history_store
from app.report_service import generate_reports

# Active background scans dictionary
active_scans: Dict[str, Dict[str, Any]] = {}
scan_cancel_flags: Dict[str, threading.Event] = {}
scans_lock = threading.Lock()


def resolve_host_service(target: str) -> Dict[str, Any]:
    """Resolve target hostname to IP address."""
    target_clean = target.strip()
    if not target_clean:
        return {"hostname": target, "ip": None, "resolved": False, "error": "Target host cannot be empty."}

    ip = scanner.resolve_host(target_clean)
    if ip is None:
        return {"hostname": target_clean, "ip": None, "resolved": False, "error": f"Unable to resolve host '{target_clean}'"}
    
    return {"hostname": target_clean, "ip": ip, "resolved": True, "error": None}


def ping_host_service(host: str) -> Dict[str, Any]:
    """Check reachability of host."""
    host_clean = host.strip()
    if not host_clean:
        return {"host": host, "ip": None, "reachable": False, "message": "Host cannot be empty."}

    # Resolve first if needed
    resolved_ip = scanner.resolve_host(host_clean) or host_clean
    reachable = scanner.ping_host(host_clean)
    
    message = "Host is reachable via ping" if reachable else "Host did not respond to ping"
    return {
        "host": host_clean,
        "ip": resolved_ip,
        "reachable": reachable,
        "message": message
    }


def _run_scan_thread(scan_id: str):
    """Worker function executed in background thread for active scan."""
    with scans_lock:
        scan_data = active_scans.get(scan_id)

    if not scan_data:
        return

    cancel_event = scan_cancel_flags.get(scan_id)
    ip = scan_data["resolved_ip"]
    start_port = scan_data["start_port"]
    end_port = scan_data["end_port"]
    threads_count = scan_data["threads"]
    
    ports = list(range(start_port, end_port + 1))
    total_ports = len(ports)
    
    scanned_count = 0
    open_ports_list = []
    start_time = time.time()

    scan_data["status"] = "running"
    scan_data["message"] = f"Scanning {total_ports} ports using {threads_count} threads..."

    with ThreadPoolExecutor(max_workers=threads_count) as executor:
        future_to_port = {
            executor.submit(scanner.scan_port, ip, port): port for port in ports
        }

        for future in as_completed(future_to_port):
            if cancel_event and cancel_event.is_set():
                scan_data["status"] = "cancelled"
                scan_data["message"] = "Scan cancelled by user."
                break

            port = future_to_port[future]
            scanned_count += 1

            try:
                is_open = future.result()
                if is_open:
                    service = scanner.get_service_name(port)
                    port_res = {
                        "port": port,
                        "status": "OPEN",
                        "service": service,
                        "protocol": "TCP"
                    }
                    open_ports_list.append(port_res)
            except Exception:
                pass

            curr_duration = round(time.time() - start_time, 2)
            progress = round((scanned_count / total_ports) * 100, 2)

            # Update live state atomically
            scan_data["scanned_ports"] = scanned_count
            scan_data["open_ports_count"] = len(open_ports_list)
            scan_data["progress"] = progress
            scan_data["duration"] = curr_duration
            
            # Keep results sorted by port number
            open_ports_list.sort(key=lambda item: item["port"])
            scan_data["results"] = list(open_ports_list)

    end_time = time.time()
    total_duration = round(end_time - start_time, 2)
    scan_data["duration"] = total_duration
    scan_data["end_time"] = datetime.now().isoformat()

    if scan_data["status"] != "cancelled":
        scan_data["status"] = "completed"
        scan_data["progress"] = 100.0
        scan_data["message"] = f"Scan completed in {total_duration:.2f} seconds. {len(open_ports_list)} open ports found."

    # Save reports & update history
    generate_reports(scan_data)
    history_store.add_or_update(scan_data)


def start_scan_service(target: str, ports_str: str, threads: int = 50) -> Dict[str, Any]:
    """Validate scan inputs, initialize scan job, and launch background scanner thread."""
    target_clean = target.strip()
    if not target_clean:
        raise ValueError("Target hostname or IP address cannot be empty.")

    # Resolve target host
    resolved = resolve_host_service(target_clean)
    if not resolved["resolved"]:
        raise ValueError(f"Unable to resolve host '{target_clean}'. Check the hostname or IP address.")

    ip = resolved["ip"]

    # Check ping reachability
    ping_res = ping_host_service(target_clean)
    reachable = ping_res["reachable"]

    # Parse port range
    try:
        start_port, end_port = scanner.parse_ports(ports_str.strip())
    except ValueError as e:
        raise ValueError(str(e))

    if not (1 <= threads <= 500):
        raise ValueError("Thread count must be between 1 and 500.")

    total_ports = end_port - start_port + 1
    scan_id = f"scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}"
    
    scan_data = {
        "scan_id": scan_id,
        "status": "resolving",
        "target": target_clean,
        "resolved_ip": ip,
        "reachable": reachable,
        "start_port": start_port,
        "end_port": end_port,
        "port_range": f"{start_port}-{end_port}",
        "total_ports": total_ports,
        "scanned_ports": 0,
        "open_ports_count": 0,
        "progress": 0.0,
        "threads": threads,
        "start_time": datetime.now().isoformat(),
        "end_time": None,
        "duration": 0.0,
        "message": "Initializing scan...",
        "results": []
    }

    with scans_lock:
        active_scans[scan_id] = scan_data
        scan_cancel_flags[scan_id] = threading.Event()

    history_store.add_or_update(scan_data)

    # Launch worker thread
    thread = threading.Thread(target=_run_scan_thread, args=(scan_id,), daemon=True)
    thread.start()

    return scan_data


def get_scan_status(scan_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve active or historical scan status."""
    with scans_lock:
        if scan_id in active_scans:
            return dict(active_scans[scan_id])
    
    # Check history store if not in active memory
    return history_store.get_scan(scan_id)


def cancel_scan_service(scan_id: str) -> bool:
    """Request cancellation of a running scan."""
    if scan_id in scan_cancel_flags:
        scan_cancel_flags[scan_id].set()
        with scans_lock:
            if scan_id in active_scans:
                active_scans[scan_id]["status"] = "cancelled"
                active_scans[scan_id]["message"] = "Scan cancellation requested..."
        return True
    return False
