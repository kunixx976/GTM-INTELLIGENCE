"""
ShadowRep AI — Alerts Module
Alert management, resolution, and custom rule creation.
"""

import uuid
from datetime import datetime

import aiosqlite
from fastapi import APIRouter, HTTPException

from database import DB_PATH
from models.alert_models import (
    AlertListResponse, AlertCreateRequest, AlertResolveResponse,
)
from services.slack_notifier import send_slack_alert

router = APIRouter()


def _row_to_alert(row: aiosqlite.Row) -> dict:
    """Convert a database row to an AlertResponse-compatible dict."""
    d = dict(row)
    return {
        "id": d["id"],
        "title": d["title"],
        "subtitle": d["subtitle"],
        "severity": d["severity"],
        "time": d["time"],
        "color": d["color"],
        "resolved": bool(d["resolved"]),
        "agent_origin": d["agent_origin"],
    }


@router.get("", response_model=AlertListResponse)
async def list_alerts(severity: str = None, resolved: bool = None):
    """List alerts with optional filters."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row

        query = "SELECT * FROM alerts WHERE 1=1"
        params = []

        if severity:
            query += " AND severity = ?"
            params.append(severity)
        if resolved is not None:
            query += " AND resolved = ?"
            params.append(int(resolved))

        query += " ORDER BY created_at DESC"

        rows = await db.execute_fetchall(query, params)
        alerts = [_row_to_alert(r) for r in rows]
        unresolved = sum(1 for a in alerts if not a["resolved"])

        return {"alerts": alerts, "total": len(alerts), "unresolved": unresolved}


@router.get("/dashboard-alerts")
async def get_dashboard_alerts():
    """Get alerts in the format expected by useDashboardStore (simplified, unresolved only)."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall(
            "SELECT * FROM alerts WHERE resolved = 0 ORDER BY created_at DESC"
        )
        return [
            {
                "id": dict(r)["id"],
                "title": dict(r)["title"],
                "subtitle": dict(r)["subtitle"],
                "time": dict(r)["time"],
                "color": dict(r)["color"],
            }
            for r in rows
        ]


@router.post("", status_code=201)
async def create_alert(req: AlertCreateRequest):
    """Create a custom alert rule."""
    alert_id = f"al-{uuid.uuid4().hex[:8]}"
    color = "#f43f5e" if req.severity == "CRITICAL" else "#f59e0b"

    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """INSERT INTO alerts (id, title, subtitle, severity, time, color, resolved, agent_origin)
               VALUES (?, ?, ?, ?, '1m', ?, 0, 'USER')""",
            (alert_id, req.title, req.subtitle, req.severity, color)
        )
        await db.commit()

    # Send to Slack if CRITICAL
    if req.severity == "CRITICAL":
        await send_slack_alert(req.title, req.severity, req.subtitle)

    return {
        "id": alert_id,
        "message": "Custom alert rule saved and activated",
    }


@router.patch("/{alert_id}/resolve")
async def resolve_alert(alert_id: str):
    """Resolve a single alert."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        row = await db.execute_fetchall(
            "SELECT * FROM alerts WHERE id = ?", (alert_id,)
        )
        if not row:
            raise HTTPException(status_code=404, detail="Alert not found")

        await db.execute(
            "UPDATE alerts SET resolved = 1 WHERE id = ?", (alert_id,)
        )
        await db.commit()

    return {"message": "Alert resolved and dismissed successfully"}


@router.post("/resolve-all", response_model=AlertResolveResponse)
async def resolve_all_alerts():
    """Resolve all unresolved alerts."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "UPDATE alerts SET resolved = 1 WHERE resolved = 0"
        )
        count = cursor.rowcount
        await db.commit()

    return {
        "resolved_count": count,
        "message": f"All {count} alerts resolved successfully",
    }


@router.delete("/{alert_id}")
async def delete_alert(alert_id: str):
    """Delete an alert permanently."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        row = await db.execute_fetchall(
            "SELECT * FROM alerts WHERE id = ?", (alert_id,)
        )
        if not row:
            raise HTTPException(status_code=404, detail="Alert not found")

        await db.execute("DELETE FROM alerts WHERE id = ?", (alert_id,))
        await db.commit()

    return {"message": "Alert deleted"}
