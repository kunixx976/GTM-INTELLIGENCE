"""
ShadowRep AI — FastAPI Application Entry Point
Central gateway for all API routes, WebSocket, and background services.
"""

import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import init_db
from services.websocket_manager import ws_manager
from services.agent_scheduler import AgentScheduler

from modules.agents import router as agents_router
from modules.competitors import router as competitors_router
from modules.insights import router as insights_router
from modules.alerts import router as alerts_router
from modules.market_intel import router as market_intel_router
from modules.ai_chat import router as chat_router


# ─── Background scheduler instance ───
scheduler = AgentScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle."""
    # Startup
    print("====================================================")
    print("|     SHADOWREP AI - Backend Engine Booting...     |")
    print("====================================================")

    await init_db()
    print(f"[CORE] Gemini AI: {'ONLINE' if settings.has_gemini_key else 'MOCK MODE (no API key)'}")
    print(f"[CORE] Slack Notifier: {'ONLINE' if settings.has_slack_webhook else 'DISABLED'}")

    # Start background agent scheduler
    scheduler_task = asyncio.create_task(scheduler.run())
    print(f"[CORE] Agent Scheduler: STARTED (tick={settings.AGENT_TICK_INTERVAL}s)")
    print("[CORE] All systems operational. Awaiting connections...")

    yield

    # Shutdown
    scheduler.stop()
    scheduler_task.cancel()
    await ws_manager.disconnect_all()
    print("[CORE] ShadowRep AI backend shut down cleanly.")


# ─── FastAPI App ───
app = FastAPI(
    title="ShadowRep AI — GTM Intelligence Engine",
    description="Production backend for autonomous GTM revenue intelligence platform",
    version="1.0.0",
    lifespan=lifespan,
)

# ─── CORS Middleware ───
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Mount API Routers ───
app.include_router(agents_router, prefix="/api/v1/agents", tags=["Agents"])
app.include_router(competitors_router, prefix="/api/v1/competitors", tags=["Competitors"])
app.include_router(insights_router, prefix="/api/v1/insights", tags=["Insights"])
app.include_router(alerts_router, prefix="/api/v1/alerts", tags=["Alerts"])
app.include_router(market_intel_router, prefix="/api/v1/market-intel", tags=["Market Intel"])
app.include_router(chat_router, prefix="/api/v1/chat", tags=["AI Chat"])


# ─── Health Check ───
@app.get("/", tags=["System"])
async def health_check():
    return {
        "status": "operational",
        "engine": "ShadowRep AI",
        "version": "1.0.0",
        "gemini": "online" if settings.has_gemini_key else "mock",
        "scheduler": "running",
    }


# ─── WebSocket Endpoint ───
@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    """Real-time telemetry stream for dashboard HUD."""
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep connection alive, receive any client messages
            data = await websocket.receive_text()
            # Client can send commands like ping or subscribe filters
            if data == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)
