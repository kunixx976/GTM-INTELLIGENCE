"""
ShadowRep AI — Agents Module
CRUD + telemetry endpoints for AI agent management.
"""

import aiosqlite
from fastapi import APIRouter, HTTPException

from database import DB_PATH
from models.agent_models import (
    AgentResponse, AgentListResponse, AgentMetricsResponse, DashboardAgent,
)

router = APIRouter()


def _row_to_agent(row: aiosqlite.Row) -> dict:
    """Convert a database row to an AgentResponse-compatible dict."""
    d = dict(row)
    return {
        "id": d["id"],
        "name": d["name"],
        "codename": d["codename"],
        "status": d["status"],
        "cpu": d["cpu"],
        "memory": d["memory"],
        "tokens_per_sec": d["tokens_per_sec"],
        "active_task": d["active_task"],
        "recent_log": d["recent_log"],
        "latency": d["latency"],
    }


@router.get("", response_model=AgentListResponse)
async def list_agents():
    """List all provisioned AI agents with current status."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall("SELECT * FROM agents ORDER BY name")
        agents = [_row_to_agent(r) for r in rows]
        return {"agents": agents, "total": len(agents)}


@router.get("/metrics", response_model=AgentMetricsResponse)
async def get_agent_metrics():
    """Get aggregate agent metrics for dashboard cards."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall("SELECT * FROM agents")
        agents = [dict(r) for r in rows]

        active = [a for a in agents if a["status"] == "ACTIVE"]
        total_tps = sum(a["tokens_per_sec"] for a in active)
        avg_cpu = sum(a["cpu"] for a in active) / len(active) if active else 0

        # Parse latency values like "12ms" -> 12
        latencies = []
        for a in active:
            try:
                latencies.append(float(a["latency"].replace("ms", "")))
            except (ValueError, AttributeError):
                pass
        avg_latency = sum(latencies) / len(latencies) if latencies else 0

        return {
            "total_agents": len(agents),
            "active_agents": len(active),
            "total_tokens_per_sec": round(total_tps, 1),
            "avg_cpu": round(avg_cpu, 1),
            "avg_latency_ms": round(avg_latency, 1),
        }


@router.get("/dashboard-agents")
async def get_dashboard_agents():
    """Get agents in the format expected by useDashboardStore (simplified)."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall("SELECT * FROM agents ORDER BY name")
        agents = []
        for r in rows:
            d = dict(r)
            status = "Active" if d["status"] == "ACTIVE" else "Idle"
            color = "#10b981" if status == "Active" else "#f59e0b"
            progress = int(d["cpu"]) if d["status"] == "ACTIVE" else max(10, int(d["cpu"]))
            agents.append({
                "name": d["name"],
                "description": d["active_task"][:40] + "..." if len(d["active_task"]) > 40 else d["active_task"],
                "status": status,
                "progress": progress,
                "color": color,
            })
        return agents


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str):
    """Get details for a specific agent."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        row = await db.execute_fetchall(
            "SELECT * FROM agents WHERE id = ?", (agent_id,)
        )
        if not row:
            raise HTTPException(status_code=404, detail="Agent not found")
        return _row_to_agent(row[0])


@router.patch("/{agent_id}/toggle")
async def toggle_agent(agent_id: str):
    """Toggle agent status between ACTIVE and IDLE."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        row = await db.execute_fetchall(
            "SELECT * FROM agents WHERE id = ?", (agent_id,)
        )
        if not row:
            raise HTTPException(status_code=404, detail="Agent not found")

        current = dict(row[0])
        new_status = "IDLE" if current["status"] == "ACTIVE" else "ACTIVE"
        new_cpu = 4 if new_status == "IDLE" else 48
        new_tps = 0 if new_status == "IDLE" else 100

        await db.execute(
            """UPDATE agents SET status = ?, cpu = ?, tokens_per_sec = ?,
               updated_at = CURRENT_TIMESTAMP WHERE id = ?""",
            (new_status, new_cpu, new_tps, agent_id)
        )
        await db.commit()

        return {
            "id": agent_id,
            "name": current["name"],
            "previous_status": current["status"],
            "new_status": new_status,
            "message": f"Agent {current['name']} is now {new_status}",
        }


@router.get("/{agent_id}/telemetry")
async def get_agent_telemetry(agent_id: str):
    """Get telemetry history for a specific agent (latest metrics snapshot)."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        row = await db.execute_fetchall(
            "SELECT * FROM agents WHERE id = ?", (agent_id,)
        )
        if not row:
            raise HTTPException(status_code=404, detail="Agent not found")

        agent = dict(row[0])
        return {
            "agent_id": agent["id"],
            "cpu": agent["cpu"],
            "memory": agent["memory"],
            "tokens_per_sec": agent["tokens_per_sec"],
            "active_task": agent["active_task"],
            "recent_log": agent["recent_log"],
            "latency": agent["latency"],
        }
