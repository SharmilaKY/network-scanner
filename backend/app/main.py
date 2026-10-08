from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from typing import List

from app.schemas import (
    ResolveRequest,
    ResolveResponse,
    PingRequest,
    PingResponse,
    ScanRequest,
    ScanStatusResponse,
    ScanHistoryItem
)
from app.scanner_service import (
    resolve_host_service,
    ping_host_service,
    start_scan_service,
    get_scan_status,
    cancel_scan_service
)
from app.history_service import history_store
from app.report_service import get_report_file

app = FastAPI(
    title="Network Ping & TCP Port Scanner API",
    description="Full-stack Web API for Network Reconnaissance, Ping Reachability & TCP Port Scanning",
    version="1.0.0"
)

# Configure CORS for frontend dev server & docker containers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in dev environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Return API status information."""
    return {
        "name": "Network Ping & TCP Port Scanner API",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }


@app.get("/api/health")
def health_check():
    """Return backend health status."""
    return {"status": "healthy"}


@app.post("/api/resolve", response_model=ResolveResponse)
def resolve_host_endpoint(req: ResolveRequest):
    """Resolve a hostname or IP address."""
    result = resolve_host_service(req.host)
    if not result["resolved"]:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=result
        )
    return result


@app.post("/api/ping", response_model=PingResponse)
def ping_host_endpoint(req: PingRequest):
    """Check host reachability using ping."""
    result = ping_host_service(req.host)
    return result


@app.post("/api/scan", response_model=ScanStatusResponse)
def create_scan_endpoint(req: ScanRequest):
    """Initiate a multithreaded TCP port scan."""
    try:
        scan_data = start_scan_service(
            target=req.host,
            ports_str=req.ports,
            threads=req.threads
        )
        return scan_data
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err)
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Scan initialization error: {str(err)}"
        )


@app.get("/api/scan/{scan_id}", response_model=ScanStatusResponse)
def get_scan_endpoint(scan_id: str):
    """Fetch current status or results of a scan."""
    scan_data = get_scan_status(scan_id)
    if not scan_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan ID '{scan_id}' not found."
        )
    return scan_data


@app.post("/api/scan/{scan_id}/cancel")
def cancel_scan_endpoint(scan_id: str):
    """Cancel an active scan."""
    success = cancel_scan_service(scan_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan ID '{scan_id}' is not currently active."
        )
    return {"message": "Cancellation request submitted.", "scan_id": scan_id}


@app.get("/api/history", response_model=List[ScanHistoryItem])
def get_history_endpoint():
    """Retrieve list of previous scan summaries."""
    scans = history_store.get_all_scans()
    return scans


@app.get("/api/history/{scan_id}", response_model=ScanStatusResponse)
def get_history_detail_endpoint(scan_id: str):
    """Retrieve full details of a past scan."""
    scan_data = history_store.get_scan(scan_id)
    if not scan_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan ID '{scan_id}' not found in history."
        )
    return scan_data


@app.get("/api/reports/{scan_id}/json")
def download_json_report(scan_id: str):
    """Download scan results as JSON file."""
    file_path = get_report_file(scan_id, "json")
    if not file_path or not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"JSON report for scan '{scan_id}' was not found."
        )
    return FileResponse(
        path=file_path,
        media_type="application/json",
        filename=f"scan_report_{scan_id}.json"
    )


@app.get("/api/reports/{scan_id}/txt")
def download_txt_report(scan_id: str):
    """Download scan results as TXT file."""
    file_path = get_report_file(scan_id, "txt")
    if not file_path or not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"TXT report for scan '{scan_id}' was not found."
        )
    return FileResponse(
        path=file_path,
        media_type="text/plain",
        filename=f"scan_report_{scan_id}.txt"
    )
