import sys
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
BACKEND_DIR = Path(__file__).resolve().parent.parent

if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_resolve_endpoint_valid():
    response = client.post("/api/resolve", json={"host": "localhost"})
    assert response.status_code == 200
    data = response.json()
    assert data["resolved"] is True
    assert data["hostname"] == "localhost"


def test_resolve_endpoint_invalid():
    response = client.post("/api/resolve", json={"host": "invalid_domain_that_does_not_exist_9999.local"})
    assert response.status_code == 400
    data = response.json()
    assert data["resolved"] is False


def test_ping_endpoint():
    response = client.post("/api/ping", json={"host": "127.0.0.1"})
    assert response.status_code == 200
    data = response.json()
    assert data["host"] == "127.0.0.1"


def test_scan_lifecycle():
    # Start scan
    response = client.post("/api/scan", json={"host": "127.0.0.1", "ports": "8080", "threads": 10})
    assert response.status_code == 200
    scan_data = response.json()
    scan_id = scan_data["scan_id"]
    assert scan_data["target"] == "127.0.0.1"
    assert scan_data["total_ports"] == 1

    # Poll status until completed or max timeout
    for _ in range(20):
        time.sleep(0.2)
        status_res = client.get(f"/api/scan/{scan_id}")
        assert status_res.status_code == 200
        res_json = status_res.json()
        if res_json["status"] in ["completed", "failed", "cancelled"]:
            break

    # Verify history endpoint
    hist_res = client.get("/api/history")
    assert hist_res.status_code == 200
    history_list = hist_res.json()
    assert any(item["scan_id"] == scan_id for item in history_list)

    # Verify report download
    json_rep = client.get(f"/api/reports/{scan_id}/json")
    assert json_rep.status_code == 200

    txt_rep = client.get(f"/api/reports/{scan_id}/txt")
    assert txt_rep.status_code == 200
