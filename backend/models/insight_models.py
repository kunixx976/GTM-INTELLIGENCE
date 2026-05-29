"""Insight Pydantic models — request/response schemas."""

from pydantic import BaseModel
from typing import Optional


class InsightResponse(BaseModel):
    id: str
    title: str
    summary: str
    full_report: str
    insight_type: str
    generated_by: str
    created_at: str


class InsightListResponse(BaseModel):
    insights: list[InsightResponse]
    total: int


class InsightGenerateRequest(BaseModel):
    topic: Optional[str] = "general_briefing"
    focus_competitors: Optional[list[str]] = None


class BriefingStatusResponse(BaseModel):
    is_running: bool
    current_step: int
    total_steps: int
    logs: list[str]
