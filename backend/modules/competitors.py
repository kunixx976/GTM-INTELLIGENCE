"""
ShadowRep AI — Competitors Module
CRUD + pricing trends for competitor tracking.
"""

import uuid
import random
from datetime import datetime

import aiosqlite
from fastapi import APIRouter, HTTPException

from database import DB_PATH
from models.competitor_models import (
    CompetitorResponse, CompetitorListResponse, CompetitorCreateRequest,
    PricingTrendsResponse,
)

router = APIRouter()


def _row_to_competitor(row: aiosqlite.Row) -> dict:
    """Convert a database row to a CompetitorResponse-compatible dict."""
    d = dict(row)
    return {
        "id": d["id"],
        "name": d["name"],
        "domain": d["domain"],
        "logo": d["logo"],
        "pricing_status": d["pricing_status"],
        "last_scraped": d["last_scraped"],
        "hiring_intent": d["hiring_intent"],
        "cta_changes": d["cta_changes"],
        "progress": d["progress"],
        "color": d["color"],
    }


@router.get("", response_model=CompetitorListResponse)
async def list_competitors():
    """List all tracked competitors."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall(
            "SELECT * FROM competitors ORDER BY progress DESC"
        )
        competitors = [_row_to_competitor(r) for r in rows]
        return {"competitors": competitors, "total": len(competitors)}


@router.get("/dashboard-competitors")
async def get_dashboard_competitors():
    """Get competitors in the format expected by useDashboardStore (simplified)."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall(
            "SELECT * FROM competitors ORDER BY progress DESC"
        )
        return [
            {
                "name": dict(r)["name"],
                "logo": dict(r)["logo"],
                "progress": dict(r)["progress"],
                "color": dict(r)["color"],
            }
            for r in rows
        ]


@router.get("/pricing-trends", response_model=PricingTrendsResponse)
async def get_pricing_trends():
    """Get pricing trend data formatted for Recharts."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall(
            "SELECT * FROM pricing_trends ORDER BY id"
        )

        # Pivot from rows to Recharts-friendly format
        time_map = {}
        for r in rows:
            d = dict(r)
            time_label = d["time_label"]
            if time_label not in time_map:
                time_map[time_label] = {"time": time_label}
            time_map[time_label][d["competitor_name"]] = d["price_index"]

        trends = list(time_map.values())
        return {"trends": trends}


@router.post("", status_code=201)
async def create_competitor(req: CompetitorCreateRequest):
    """Add a new competitor to the watchlist."""
    comp_id = f"c-{uuid.uuid4().hex[:8]}"
    logo = req.logo or req.name[:2].upper()
    progress = random.randint(40, 80)

    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """INSERT INTO competitors (id, name, domain, logo, pricing_status,
               last_scraped, hiring_intent, cta_changes, progress, color)
               VALUES (?, ?, ?, ?, 'UNKNOWN', 'Just added', 'LOW', 0, ?, '#52525b')""",
            (comp_id, req.name, req.domain, logo, progress)
        )

        # Add a feed activity for the new competitor
        activity_id = f"ac-new-{uuid.uuid4().hex[:8]}"
        await db.execute(
            """INSERT INTO activities (id, timestamp, category, source, message, impact_score)
               VALUES (?, ?, 'INFO', 'SYSTEM',
                       'Initialized tracking module for new competitor footprint: ' || ?, 40)""",
            (activity_id, datetime.utcnow().strftime("%H:%M:%S"), req.name)
        )

        await db.commit()

    return {
        "id": comp_id,
        "name": req.name,
        "message": f"Added {req.name} to competitor watchlist",
    }


@router.get("/{competitor_id}")
async def get_competitor(competitor_id: str):
    """Get detailed competitor dossier."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        row = await db.execute_fetchall(
            "SELECT * FROM competitors WHERE id = ?", (competitor_id,)
        )
        if not row:
            raise HTTPException(status_code=404, detail="Competitor not found")
        return _row_to_competitor(row[0])


@router.delete("/{competitor_id}")
async def delete_competitor(competitor_id: str):
    """Remove a competitor from the watchlist."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        row = await db.execute_fetchall(
            "SELECT name FROM competitors WHERE id = ?", (competitor_id,)
        )
        if not row:
            raise HTTPException(status_code=404, detail="Competitor not found")

        name = dict(row[0])["name"]
        await db.execute("DELETE FROM competitors WHERE id = ?", (competitor_id,))
        await db.commit()

    return {"message": f"Removed {name} from watchlist"}
