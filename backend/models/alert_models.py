"""Alert Pydantic models — request/response schemas."""

from pydantic import BaseModel
from typing import Optional, Literal


class AlertResponse(BaseModel):
    id: str
    title: str
    subtitle: str
    severity: Literal["CRITICAL", "HIGH", "MEDIUM", "LOW"]
    time: str
    color: str
    resolved: bool
    agent_origin: str


class AlertListResponse(BaseModel):
    alerts: list[AlertResponse]
    total: int
    unresolved: int


class AlertCreateRequest(BaseModel):
    title: str
    subtitle: Optional[str] = "Custom configured trigger fired"
    severity: Literal["CRITICAL", "HIGH", "MEDIUM", "LOW"] = "MEDIUM"


class AlertResolveResponse(BaseModel):
    resolved_count: int
    message: str


# Dashboard-facing alert model (matches useDashboardStore)
class DashboardAlert(BaseModel):
    id: str
    title: str
    subtitle: str
    time: str
    color: str
