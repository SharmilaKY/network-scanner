
import socket
import subprocess
import platform
import time
import argparse
import json
import sys

from datetime import datetime
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed


# ============================================================
# DISPLAY
# ============================================================

def print_banner():
    """Display the application banner."""

    print("\n")
    print("=" * 68)
    print("              NETWORK PING & PORT SCANNER")
    print("=" * 68)
    print("        Python Network Reconnaissance CLI Tool")
    print("        TCP Scanning | Service Detection | Reports")
    print("=" * 68)


def print_section(title):
    """Display a formatted section heading."""

    print()
    print("-" * 68)
    print(f"  {title}")
    print("-" * 68)


# ============================================================
# HOST RESOLUTION
# ============================================================

def resolve_host(target):
    """Resolve a hostname or IP address."""

    try:
        return socket.gethostbyname(target)

    except socket.gaierror:
        return None


# ============================================================
# PING
# ============================================================

def ping_host(target):
    """Check whether the target host is reachable."""

    system = platform.system().lower()

    if system == "windows":
        command = [
            "ping",
            "-n",
            "1",
            "-w",
            "1000",
            target
        ]

    else:
        command = [
            "ping",
            "-c",
            "1",
            "-W",
            "1",
            target
        ]

    try:

        result = subprocess.run(
            command,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=3
        )

        return result.returncode == 0

    except (
        subprocess.TimeoutExpired,
        OSError
    ):
        return False


# ============================================================
# SINGLE PORT SCANNER
# ============================================================

def scan_port(ip, port):
    """Check whether a TCP port is open."""

    try:

        with socket.socket(
            socket.AF_INET,
            socket.SOCK_STREAM
        ) as sock:

            sock.settimeout(0.5)

            result = sock.connect_ex(
                (ip, port)
            )

            return result == 0

    except socket.error:

        return False


# ============================================================
# SERVICE DETECTION
# ============================================================

def get_service_name(port):
    """Identify the service associated with a TCP port."""

    common_services = {

        20: "FTP-Data",
        21: "FTP",
        22: "SSH",
        23: "Telnet",
        25: "SMTP",
        53: "DNS",
        80: "HTTP",
        110: "POP3",
        143: "IMAP",
        443: "HTTPS",
        3306: "MySQL",
        3389: "RDP",
        5432: "PostgreSQL",
        6379: "Redis",
        8080: "HTTP-Alt"
    }

    try:

        return socket.getservbyport(
            port,
            "tcp"
        )

    except OSError:

        return common_services.get(
            port,
            "Unknown"
        )


# ============================================================
# PORT VALIDATION
# ============================================================

def parse_ports(port_input):
    """Validate and parse a port or port range."""

    try:

        if "-" in port_input:

            parts = port_input.split("-", 1)

            if len(parts) != 2:
                raise ValueError

            start_port = int(
                parts[0].strip()
            )

            end_port = int(
                parts[1].strip()
            )

        else:

            start_port = int(
                port_input.strip()
            )

            end_port = start_port

        if not (
            1 <= start_port <= 65535
        ):
            raise ValueError

        if not (
            1 <= end_port <= 65535
        ):
            raise ValueError

        if start_port > end_port:
            raise ValueError

        return start_port, end_port

    except (
        ValueError,
        TypeError
    ):

        raise ValueError(
            "Invalid port format. "
            "Use a single port such as 80 "
            "or a range such as 1-1024."
        )


# ============================================================
# MULTITHREADED PORT SCANNER
# ============================================================

def scan_port_range(
    ip,
    start_port,
    end_port,
    max_workers=100
):
    """Scan a range of TCP ports concurrently."""

    open_ports = []

    ports = list(
        range(
            start_port,
            end_port + 1
        )
    )

    total_ports = len(ports)

    scanned_ports = 0

    start_time = time.time()

    print_section(
        f"SCANNING PORTS {start_port}-{end_port}"
    )

    print(
        f"  Threads : {max_workers}"
    )

    print(
        f"  Total   : {total_ports} ports"
    )

    print()

    with ThreadPoolExecutor(
        max_workers=max_workers
    ) as executor:

        future_to_port = {
            executor.submit(
                scan_port,
                ip,
                port
            ): port

            for port in ports
        }

        for future in as_completed(
            future_to_port
        ):

            port = future_to_port[
                future
            ]

            scanned_ports += 1

            try:

                is_open = future.result()

                if is_open:

                    service = get_service_name(
                        port
                    )

                    open_ports.append({

                        "port": port,

                        "service": service

                    })

                    print(
                        f"  [+] {port:<6} "
                        f"OPEN     {service}"
                    )

            except Exception as error:

                print(
                    f"\n  [!] Port {port} "
                    f"error: {error}"
                )

            # Progress indicator
            progress = (
                scanned_ports /
                total_ports
            ) * 100

            sys.stdout.write(
                f"\r  Progress: "
                f"{progress:6.2f}% "
                f"({scanned_ports}/{total_ports})"
            )

            sys.stdout.flush()

    print()

    end_time = time.time()

    scan_time = (
        end_time -
        start_time
    )

    open_ports.sort(
        key=lambda item:
        item["port"]
    )

    print(
        f"\n  Scan completed in "
        f"{scan_time:.2f} seconds."
    )

    return (
        open_ports,
        scan_time
    )


# ============================================================
# JSON REPORT
# ============================================================

def save_json_report(
    target,
    ip,
    start_port,
    end_port,
    open_ports,
    scan_time
):
    """Save scan results as JSON."""

    results_dir = Path(
        "results"
    )

    results_dir.mkdir(
        exist_ok=True
    )

    report = {

        "scan_time":
            datetime.now().isoformat(),

        "target":
            target,

        "resolved_ip":
            ip,

        "port_range": {

            "start":
                start_port,

            "end":
                end_port
        },

        "ports_scanned":
            end_port -
            start_port +
            1,

        "open_ports":
            len(open_ports),

        "scan_duration_seconds":
            round(
                scan_time,
                2
            ),

        "results":
            open_ports
    }

    report_file = (
        results_dir /
        "scan_report.json"
    )

    with open(
        report_file,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            report,
            file,
            indent=4
        )

    print(
        f"[+] JSON report: "
        f"{report_file}"
    )


# ============================================================
# TXT REPORT
# ============================================================

def save_txt_report(
    target,
    ip,
    start_port,
    end_port,
    open_ports,
    scan_time
):
    """Save scan results as TXT."""

    results_dir = Path(
        "results"
    )

    results_dir.mkdir(
        exist_ok=True
    )

    report_file = (
        results_dir /
        "scan_report.txt"
    )

    with open(
        report_file,
        "w",
        encoding="utf-8"
    ) as file:

        file.write(
            "=" * 68 + "\n"
        )

        file.write(
            "              NETWORK PING & "
            "PORT SCANNER REPORT\n"
        )

        file.write(
            "=" * 68 + "\n\n"
        )

        file.write(
            f"Scan Time     : "
            f"{datetime.now()}\n"
        )

        file.write(
            f"Target        : "
            f"{target}\n"
        )

        file.write(
            f"Resolved IP   : "
            f"{ip}\n"
        )

        file.write(
            f"Port Range    : "
            f"{start_port}-{end_port}\n"
        )

        file.write(
            f"Ports Scanned : "
            f"{end_port - start_port + 1}\n"
        )

        file.write(
            f"Open Ports    : "
            f"{len(open_ports)}\n"
        )

        file.write(
            f"Duration      : "
            f"{scan_time:.2f} seconds\n\n"
        )

        file.write(
            "-" * 68 + "\n"
        )

        file.write(
            "OPEN PORTS\n"
        )

        file.write(
            "-" * 68 + "\n"
        )

        if open_ports:

            for item in open_ports:

                file.write(
                    f"Port: "
                    f"{item['port']:<6}"
                    f"Service: "
                    f"{item['service']}\n"
                )

        else:

            file.write(
                "No open ports found.\n"
            )

        file.write(
            "\n" +
            "=" * 68 +
            "\n"
        )

    print(
        f"[+] TXT report : "
        f"{report_file}"
    )


# ============================================================
# CLI ARGUMENTS
# ============================================================

def parse_arguments():
    """Parse command-line arguments."""

    parser = argparse.ArgumentParser(

        description=
        "Professional Network Ping & "
        "TCP Port Scanner",

        formatter_class=
        argparse.RawTextHelpFormatter
    )

    parser.add_argument(

        "--host",

        required=False,

        help=
        "Target IP address or hostname"
    )

    parser.add_argument(

        "--ports",

        required=False,

        help=
        "Port or range\n"
        "Examples: 80 or 1-1024"
    )

    parser.add_argument(

        "--threads",

        type=int,

        default=100,

        help=
        "Concurrent threads "
        "(default: 100)"
    )

    return parser.parse_args()


# ============================================================
# MAIN
# ============================================================

def main():

    print_banner()

    args = parse_arguments()

    # --------------------------------------------------------
    # TARGET
    # --------------------------------------------------------

    if args.host:

        target = args.host.strip()

    else:

        target = input(
            "\n  Enter target IP/hostname: "
        ).strip()

    if not target:

        print(
            "\n[-] Error: Target cannot be empty."
        )

        return

    # --------------------------------------------------------
    # PORT
    # --------------------------------------------------------

    if args.ports:

        port_input = args.ports.strip()

    else:

        port_input = input(
            "  Enter port/range "
            "(example: 80 or 1-1024): "
        ).strip()

    if not port_input:

        print(
            "\n[-] Error: Port input cannot "
            "be empty."
        )

        return

    # --------------------------------------------------------
    # THREAD VALIDATION
    # --------------------------------------------------------

    if args.threads < 1:

        print(
            "\n[-] Error: Threads must be "
            "greater than 0."
        )

        return

    if args.threads > 500:

        print(
            "\n[-] Error: Maximum thread "
            "limit is 500."
        )

        return

    # --------------------------------------------------------
    # RESOLVE HOST
    # --------------------------------------------------------

    print_section(
        "TARGET INFORMATION"
    )

    print(
        f"  Target       : {target}"
    )

    ip = resolve_host(
        target
    )

    if ip is None:

        print(
            "\n[-] Error: Unable to resolve "
            "the target."
        )

        return

    print(
        f"  Resolved IP  : {ip}"
    )

    # --------------------------------------------------------
    # PING
    # --------------------------------------------------------

    print_section(
        "HOST REACHABILITY"
    )

    print(
        "  [*] Sending ping..."
    )

    reachable = ping_host(
        target
    )

    if reachable:

        print(
            "  [+] Host is reachable"
        )

    else:

        print(
            "  [!] Host did not respond "
            "to ping."
        )

        print(
            "  [*] Continuing with "
            "TCP port scanning..."
        )

    # --------------------------------------------------------
    # PORT PARSING
    # --------------------------------------------------------

    try:

        start_port, end_port = (
            parse_ports(
                port_input
            )
        )

    except ValueError as error:

        print(
            f"\n[-] Error: {error}"
        )

        return

    # --------------------------------------------------------
    # SCAN
    # --------------------------------------------------------

    open_ports, scan_time = (
        scan_port_range(

            ip,

            start_port,

            end_port,

            args.threads
        )
    )

    # --------------------------------------------------------
    # SUMMARY
    # --------------------------------------------------------

    print_section(
        "SCAN SUMMARY"
    )

    total_ports = (
        end_port -
        start_port +
        1
    )

    print(
        f"  Target        : {ip}"
    )

    print(
        f"  Ports scanned : {total_ports}"
    )

    print(
        f"  Open ports    : "
        f"{len(open_ports)}"
    )

    print(
        f"  Duration      : "
        f"{scan_time:.2f} seconds"
    )

    if open_ports:

        print(
            "\n  OPEN PORTS"
        )

        print(
            "  " + "-" * 40
        )

        for item in open_ports:

            print(
                f"  {item['port']:<8}"
                f"{item['service']}"
            )

    else:

        print(
            "\n  No open ports found."
        )

    # --------------------------------------------------------
    # REPORTS
    # --------------------------------------------------------

    print_section(
        "GENERATING REPORTS"
    )

    save_json_report(

        target,

        ip,

        start_port,

        end_port,

        open_ports,

        scan_time
    )

    save_txt_report(

        target,

        ip,

        start_port,

        end_port,

        open_ports,

        scan_time
    )

    # --------------------------------------------------------
    # COMPLETE
    # --------------------------------------------------------

    print_section(
        "SCAN COMPLETE"
    )

    print(
        "  [+] Scan finished successfully."
    )

    print(
        "  [+] Results available in "
        "the 'results' folder."
    )

    print()


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()

