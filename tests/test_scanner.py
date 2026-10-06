import sys
from pathlib import Path

# Add project root to Python path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import scanner


def test_resolve_localhost():
    ip = scanner.resolve_host("localhost")
    assert ip is not None


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