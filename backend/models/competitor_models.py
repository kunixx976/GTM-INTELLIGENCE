"""Competitor Pydantic models — request/response schemas."""

from pydantic import BaseModel
from typing import Optional, Literal


class CompetitorResponse(BaseModel):
    id: str
    name: str
    domain: str
    logo: str
    pricing_status: Literal["INCREASED", "DECREASED", "STABLE", "UNKNOWN"]
    last_scraped: str
    hiring_intent: Literal["HIGH", "MEDIUM", "LOW"]
    cta_changes: int
    progress: int
    color: str


class CompetitorListResponse(BaseModel):
    competitors: list[CompetitorResponse]
    total: int


class CompetitorCreateRequest(BaseModel):
    name: str
    domain: Optional[str] = ""
    logo: Optional[str] = ""


class CompetitorUpdateRequest(BaseModel):
    name: Optional[str] = None
    domain: Optional[str] = None
    pricing_status: Optional[Literal["INCREASED", "DECREASED", "STABLE", "UNKNOWN"]] = None
    hiring_intent: Optional[Literal["HIGH", "MEDIUM", "LOW"]] = None


class PricingTrendPoint(BaseModel):
    time: str
    competitor_name: str
    price_index: float


class PricingTrendsResponse(BaseModel):
    trends: list[dict]  # [{ time: "09:00", Datadog: 100, Dynatrace: 98, ... }]


# Dashboard-facing competitor model (matches useDashboardStore)
class DashboardCompetitor(BaseModel):
    name: str
    logo: str
    progress: int
    color: str
