"""Market intelligence Pydantic models — request/response schemas."""

from pydantic import BaseModel
from typing import Optional, Literal


class ActivityResponse(BaseModel):
    id: str
    timestamp: str
    category: Literal["CRITICAL", "SIGNAL", "INFO", "WARNING"]
    source: str
    message: str
    impact_score: int


class ActivityFeedResponse(BaseModel):
    activities: list[ActivityResponse]
    total: int


class MetricResponse(BaseModel):
    id: str
    label: str
    value: str
    change: float
    is_positive: bool
    telemetry_type: Literal["cyan", "green", "amber", "crimson"]


class MetricsResponse(BaseModel):
    metrics: list[MetricResponse]


class TrendDataResponse(BaseModel):
    trends: list[dict]


# Dashboard-facing feed item (matches useDashboardStore)
class DashboardFeedItem(BaseModel):
    time: str
    text: str
    tag: str
    tagColor: str
