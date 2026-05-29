"""
ShadowRep AI — Market Intelligence Module
GTM activity feed, trend data, and dashboard metrics.
"""

import aiosqlite
from fastapi import APIRouter

from database import DB_PATH
from models.market_models import (
    ActivityFeedResponse, MetricsResponse, TrendDataResponse,
)

router = APIRouter()


@router.get("/feed", response_model=ActivityFeedResponse)
async def get_activity_feed(limit: int = 50):
    """Get the GTM activity feed (latest events)."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall(
            "SELECT * FROM activities ORDER BY created_at DESC LIMIT ?",
            (limit,)
        )
        activities = []
        for r in rows:
            d = dict(r)
            activities.append({
                "id": d["id"],
                "timestamp": d["timestamp"],
                "category": d["category"],
                "source": d["source"],
                "message": d["message"],
                "impact_score": d["impact_score"],
            })
        return {"activities": activities, "total": len(activities)}


@router.get("/dashboard-feed")
async def get_dashboard_feed(limit: int = 20):
    """Get feed items in the format expected by useDashboardStore."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall(
            "SELECT * FROM activities ORDER BY created_at DESC LIMIT ?",
            (limit,)
        )

        tag_color_map = {
            "CRITICAL": "#ef4444",
            "SIGNAL": "#a855f7",
            "WARNING": "#f59e0b",
            "INFO": "#3b82f6",
        }

        tag_map = {
            "CRITICAL": "CRITICAL",
            "SIGNAL": "BUYING SIGNAL",
            "WARNING": "WARNING",
            "INFO": "COMPETITOR",
        }

        feed_items = []
        for r in rows:
            d = dict(r)
            category = d["category"]
            feed_items.append({
                "time": d["timestamp"],
                "text": d["message"],
                "tag": tag_map.get(category, "INFO"),
                "tagColor": tag_color_map.get(category, "#3b82f6"),
            })
        return feed_items


@router.get("/metrics", response_model=MetricsResponse)
async def get_metrics():
    """Get dashboard metric cards data."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall("SELECT * FROM metrics ORDER BY id")
        metrics = []
        for r in rows:
            d = dict(r)
            metrics.append({
                "id": d["id"],
                "label": d["label"],
                "value": d["value"],
                "change": d["change"],
                "is_positive": bool(d["is_positive"]),
                "telemetry_type": d["telemetry_type"],
            })
        return {"metrics": metrics}


@router.get("/trends", response_model=TrendDataResponse)
async def get_market_trends():
    """Get market trend data formatted for Recharts."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall(
            "SELECT * FROM pricing_trends ORDER BY id"
        )

        # Pivot rows to Recharts-friendly format
        time_map = {}
        for r in rows:
            d = dict(r)
            time_label = d["time_label"]
            if time_label not in time_map:
                time_map[time_label] = {"time": time_label}
            time_map[time_label][d["competitor_name"]] = d["price_index"]

        return {"trends": list(time_map.values())}
