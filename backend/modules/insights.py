"""
ShadowRep AI — Insights Module
AI-generated GTM insights and briefing reports.
"""

import uuid
import asyncio
from datetime import datetime

import aiosqlite
from fastapi import APIRouter, BackgroundTasks

from database import DB_PATH
from models.insight_models import (
    InsightListResponse, InsightGenerateRequest, BriefingStatusResponse,
)
from services import gemini_service
from services.websocket_manager import ws_manager

router = APIRouter()

# In-memory briefing state (shared across requests)
_briefing_state = {
    "is_running": False,
    "current_step": 0,
    "total_steps": 4,
    "logs": [],
}


@router.get("", response_model=InsightListResponse)
async def list_insights():
    """List all AI-generated insight reports."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall(
            "SELECT * FROM insights ORDER BY created_at DESC"
        )
        insights = []
        for r in rows:
            d = dict(r)
            insights.append({
                "id": d["id"],
                "title": d["title"],
                "summary": d["summary"],
                "full_report": d["full_report"],
                "insight_type": d["insight_type"],
                "generated_by": d["generated_by"],
                "created_at": d.get("created_at", ""),
            })
        return {"insights": insights, "total": len(insights)}


@router.get("/briefing-status", response_model=BriefingStatusResponse)
async def get_briefing_status():
    """Get the current briefing generation status."""
    return _briefing_state


@router.post("/generate")
async def generate_insight(
    req: InsightGenerateRequest,
    background_tasks: BackgroundTasks,
):
    """Trigger AI briefing generation. Runs in background with progress updates."""
    if _briefing_state["is_running"]:
        return {"message": "A briefing is already in progress", "status": "running"}

    # Start briefing generation in background
    background_tasks.add_task(_run_briefing, req.topic, req.focus_competitors)

    return {
        "message": "Briefing generation started",
        "status": "started",
    }


async def _run_briefing(topic: str, focus_competitors: list[str] = None):
    """Background task that runs the briefing generation with step-by-step progress."""
    global _briefing_state

    _briefing_state = {
        "is_running": True,
        "current_step": 0,
        "total_steps": 4,
        "logs": ["Booting ShadowRep search nodes...", "Connecting target endpoints..."],
    }

    steps = [
        {"delay": 1.5, "log": "Analyzing SEC Form 8-K records for recent filings..."},
        {"delay": 2.0, "log": "Scraping competitor pricing pages & diffing HTML tables..."},
        {"delay": 2.0, "log": "Running heuristic GTM buyer intent evaluation model..."},
        {"delay": 1.5, "log": "Generating strategic brief with Gemini AI..."},
    ]

    # Broadcast initial state
    await ws_manager.broadcast({
        "type": "briefing_progress",
        "data": _briefing_state,
    })

    for idx, step in enumerate(steps):
        await asyncio.sleep(step["delay"])
        _briefing_state["current_step"] = idx + 1
        _briefing_state["logs"].append(step["log"])

        await ws_manager.broadcast({
            "type": "briefing_progress",
            "data": _briefing_state,
        })

    # Generate actual briefing content
    try:
        # Fetch competitor data for context
        competitor_data = []
        async with aiosqlite.connect(DB_PATH) as db:
            db.row_factory = aiosqlite.Row
            rows = await db.execute_fetchall("SELECT * FROM competitors")
            competitor_data = [dict(r) for r in rows]

        briefing = await gemini_service.generate_briefing(competitor_data, topic)

        # Save to database
        insight_id = f"ins-{uuid.uuid4().hex[:8]}"
        async with aiosqlite.connect(DB_PATH) as db:
            await db.execute(
                """INSERT INTO insights (id, title, summary, full_report, insight_type, generated_by)
                   VALUES (?, ?, ?, ?, 'briefing', 'GEMINI')""",
                (insight_id, briefing["title"], briefing["summary"], briefing["full_report"])
            )

            # Add to activity feed
            activity_id = f"ac-brief-{uuid.uuid4().hex[:8]}"
            await db.execute(
                """INSERT INTO activities (id, timestamp, category, source, message, impact_score)
                   VALUES (?, ?, 'SIGNAL', 'SYSTEM', ?, 85)""",
                (activity_id, datetime.utcnow().strftime("%H:%M:%S"),
                 f"AI Intel Report: {briefing['title']}")
            )

            # Add critical alert for findings
            alert_id = f"al-brief-{uuid.uuid4().hex[:8]}"
            await db.execute(
                """INSERT INTO alerts (id, title, subtitle, severity, time, color, resolved, agent_origin)
                   VALUES (?, ?, ?, 'HIGH', '1m', '#f59e0b', 0, 'GEMINI')""",
                (alert_id, briefing["title"], briefing["summary"][:80])
            )

            await db.commit()

        _briefing_state["logs"].append(
            f"Generated strategic brief: {briefing['title']}"
        )

    except Exception as e:
        _briefing_state["logs"].append(f"Error during generation: {str(e)}")

    _briefing_state["is_running"] = False

    # Final broadcast
    await ws_manager.broadcast({
        "type": "briefing_complete",
        "data": _briefing_state,
    })


@router.get("/{insight_id}")
async def get_insight(insight_id: str):
    """Get a specific insight report."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        row = await db.execute_fetchall(
            "SELECT * FROM insights WHERE id = ?", (insight_id,)
        )
        if not row:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Insight not found")
        d = dict(row[0])
        return {
            "id": d["id"],
            "title": d["title"],
            "summary": d["summary"],
            "full_report": d["full_report"],
            "insight_type": d["insight_type"],
            "generated_by": d["generated_by"],
            "created_at": d.get("created_at", ""),
        }
