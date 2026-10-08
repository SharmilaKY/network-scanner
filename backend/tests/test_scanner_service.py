import sys
from pathlib import Path

# Add project root and backend to Python path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
BACKEND_DIR = Path(__file__).resolve().parent.parent

if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import scanner
from app.scanner_service import resolve_host_service, ping_host_service, start_scan_service, get_scan_status


def test_resolve_localhost():
    ip = scanner.resolve_host("localhost")
    assert ip is not None
    res = resolve_host_service("localhost")
    assert res["resolved"] is True
    assert res["ip"] is not None


def test_parse_single_port():
    start, end = scanner.parse_ports("8080")
    assert start == 8080
    assert end == 8080


def test_parse_port_range():
    start, end = scanner.parse_ports("8000-8100")
    assert start == 8000
    assert end == 8100


def test_invalid_port():
    try:
        scanner.parse_ports("70000")
        assert False
    except ValueError:
        assert True


def test_service_detection():
    service = scanner.get_service_name(80)
    assert service is not None
    assert service.upper() in ["HTTP", "WWW", "80"] or len(service) > 0


def test_ping_host():
    res = ping_host_service("127.0.0.1")
    assert res["host"] == "127.0.0.1"
    assert "reachable" in res
