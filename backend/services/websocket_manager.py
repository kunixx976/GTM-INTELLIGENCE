"""
ShadowRep AI — WebSocket Connection Manager
Manages real-time telemetry streams to all connected dashboard clients.
"""

import json
from typing import List
from fastapi import WebSocket


class WebSocketManager:
    """Manages active WebSocket connections and broadcasts telemetry."""

    def __init__(self):
        self._connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        self._connections.append(websocket)
        print(f"[WS] Client connected. Active connections: {len(self._connections)}")

    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection."""
        if websocket in self._connections:
            self._connections.remove(websocket)
        print(f"[WS] Client disconnected. Active connections: {len(self._connections)}")

    async def disconnect_all(self):
        """Close all connections on shutdown."""
        for ws in self._connections:
            try:
                await ws.close()
            except Exception:
                pass
        self._connections.clear()
        print("[WS] All connections closed.")

    async def broadcast(self, message: dict):
        """Send a JSON message to all connected clients."""
        if not self._connections:
            return

        payload = json.dumps(message)
        disconnected = []

        for ws in self._connections:
            try:
                await ws.send_text(payload)
            except Exception:
                disconnected.append(ws)

        # Cleanup dead connections
        for ws in disconnected:
            self.disconnect(ws)

    async def broadcast_agent_telemetry(self, agent_data: dict):
        """Broadcast agent telemetry update."""
        await self.broadcast({
            "type": "agent_telemetry",
            "data": agent_data,
        })

    async def broadcast_activity(self, activity_data: dict):
        """Broadcast new GTM activity event."""
        await self.broadcast({
            "type": "activity_event",
            "data": activity_data,
        })

    async def broadcast_alert(self, alert_data: dict):
        """Broadcast new alert trigger."""
        await self.broadcast({
            "type": "alert_trigger",
            "data": alert_data,
        })

    async def broadcast_metric_update(self, metric_data: dict):
        """Broadcast metric value update."""
        await self.broadcast({
            "type": "metric_update",
            "data": metric_data,
        })

    @property
    def active_connections(self) -> int:
        return len(self._connections)


# Singleton instance
ws_manager = WebSocketManager()
