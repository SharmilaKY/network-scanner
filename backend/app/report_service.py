import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

# Root directory path for results
RESULTS_DIR = Path(__file__).resolve().parent.parent.parent / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)


def generate_reports(scan_data: Dict[str, Any]) -> Dict[str, Path]:
    """
    Generate JSON and TXT report files for a completed scan.
    Returns dictionary with file paths for json and txt reports.
    """
    scan_id = scan_data.get("scan_id", "scan_latest")
    target = scan_data.get("target", "unknown")
    resolved_ip = scan_data.get("resolved_ip", "unknown")
    start_port = scan_data.get("start_port", 1)
    end_port = scan_data.get("end_port", 1)
    open_ports = scan_data.get("results", [])
    scan_duration = scan_data.get("duration", 0.0)
    start_time = scan_data.get("start_time", datetime.now().isoformat())

    json_report = {
        "scan_id": scan_id,
        "scan_time": start_time,
        "target": target,
        "resolved_ip": resolved_ip,
        "port_range": {
            "start": start_port,
            "end": end_port
        },
        "ports_scanned": end_port - start_port + 1,
        "open_ports": len(open_ports),
        "scan_duration_seconds": round(scan_duration, 2),
        "results": open_ports
    }

    # Write scan_id specific JSON report & default scan_report.json
    json_path = RESULTS_DIR / f"{scan_id}.json"
    default_json_path = RESULTS_DIR / "scan_report.json"
    
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_report, f, indent=4)
    with open(default_json_path, "w", encoding="utf-8") as f:
        json.dump(json_report, f, indent=4)

    # Write scan_id specific TXT report & default scan_report.txt
    txt_path = RESULTS_DIR / f"{scan_id}.txt"
    default_txt_path = RESULTS_DIR / "scan_report.txt"

    txt_content = []
    txt_content.append("=" * 68)
    txt_content.append("              NETWORK PING & PORT SCANNER REPORT")
    txt_content.append("=" * 68 + "\n")
    txt_content.append(f"Scan ID       : {scan_id}")
    txt_content.append(f"Scan Time     : {start_time}")
    txt_content.append(f"Target        : {target}")
    txt_content.append(f"Resolved IP   : {resolved_ip}")
    txt_content.append(f"Port Range    : {start_port}-{end_port}")
    txt_content.append(f"Ports Scanned : {end_port - start_port + 1}")
    txt_content.append(f"Open Ports    : {len(open_ports)}")
    txt_content.append(f"Duration      : {scan_duration:.2f} seconds\n")
    txt_content.append("-" * 68)
    txt_content.append("OPEN PORTS")
    txt_content.append("-" * 68)

    if open_ports:
        for item in open_ports:
            port = item.get("port")
            service = item.get("service", "Unknown")
            protocol = item.get("protocol", "TCP")
            txt_content.append(f"Port: {port:<6} Protocol: {protocol:<5} Service: {service}")
    else:
        txt_content.append("No open ports found.")

    txt_content.append("\n" + "=" * 68 + "\n")

    txt_text = "\n".join(txt_content)

    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(txt_text)
    with open(default_txt_path, "w", encoding="utf-8") as f:
        f.write(txt_text)

    return {
        "json": json_path,
        "txt": txt_path
    }


def get_report_file(scan_id: str, format_type: str) -> Optional[Path]:
    """Retrieve report file path by scan_id and format ('json' or 'txt')."""
    ext = format_type.lower()
    if ext not in ["json", "txt"]:
        return None

    path = RESULTS_DIR / f"{scan_id}.{ext}"
    if path.exists():
        return path
    
    # Fallback to default report if requested scan_id matches latest or generic
    fallback = RESULTS_DIR / f"scan_report.{ext}"
    if fallback.exists():
        return fallback
        
    return None
