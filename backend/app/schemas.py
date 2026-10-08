from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class ResolveRequest(BaseModel):
    host: str = Field(..., json_schema_extra={"example": "localhost"}, description="Hostname or IP address to resolve")


class ResolveResponse(BaseModel):
    hostname: str
    ip: Optional[str] = None
    resolved: bool
    error: Optional[str] = None


class PingRequest(BaseModel):
    host: str = Field(..., json_schema_extra={"example": "127.0.0.1"}, description="Target host or IP to ping")


class PingResponse(BaseModel):
    host: str
    ip: Optional[str] = None
    reachable: bool
    message: str


class ScanRequest(BaseModel):
    host: str = Field(..., json_schema_extra={"example": "127.0.0.1"}, description="Target host or IP address")
    ports: str = Field("1-1024", json_schema_extra={"example": "8000-8100"}, description="Single port (80) or range (8000-8100)")
    threads: int = Field(50, ge=1, le=500, description="Number of worker threads (1-500)")


class PortResult(BaseModel):
    port: int
    status: str = "OPEN"
    service: str
    protocol: str = "TCP"


class ScanStatusResponse(BaseModel):
    scan_id: str
    status: str  # idle, resolving, pinging, running, completed, failed, cancelled
    target: str
    resolved_ip: Optional[str] = None
    reachable: Optional[bool] = None
    start_port: Optional[int] = None
    end_port: Optional[int] = None
    port_range: Optional[str] = None
    total_ports: int = 0
    scanned_ports: int = 0
    open_ports_count: int = 0
    progress: float = 0.0
    threads: int = 50
    start_time: str
    end_time: Optional[str] = None
    duration: float = 0.0
    message: str = ""
    results: List[PortResult] = []


class ScanHistoryItem(BaseModel):
    scan_id: str
    target: str
    resolved_ip: Optional[str] = None
    port_range: str
    open_ports_count: int
    total_ports: int
    duration: float
    start_time: str
    status: str
