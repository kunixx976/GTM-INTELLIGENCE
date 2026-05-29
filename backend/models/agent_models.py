"""Agent Pydantic models — request/response schemas."""

from pydantic import BaseModel
from typing import Optional, Literal


class AgentResponse(BaseModel):
    id: str
    name: str
    codename: str
    status: Literal["ACTIVE", "IDLE", "DEPRECATED", "DRY_RUN"]
    cpu: float
    memory: str
    tokens_per_sec: float
    active_task: str
    recent_log: str
    latency: str


class AgentListResponse(BaseModel):
    agents: list[AgentResponse]
    total: int


class AgentToggleRequest(BaseModel):
    status: Optional[Literal["ACTIVE", "IDLE", "DEPRECATED", "DRY_RUN"]] = None


class AgentMetricsResponse(BaseModel):
    total_agents: int
    active_agents: int
    total_tokens_per_sec: float
    avg_cpu: float
    avg_latency_ms: float


class AgentTelemetryEvent(BaseModel):
    agent_id: str
    cpu: float
    memory: str
    tokens_per_sec: float
    active_task: str
    recent_log: str
    latency: str
    timestamp: str


# Dashboard-facing agent model (simplified, matches useDashboardStore)
class DashboardAgent(BaseModel):
    name: str
    description: str
    status: Literal["Active", "Idle"]
    progress: int
    color: str
