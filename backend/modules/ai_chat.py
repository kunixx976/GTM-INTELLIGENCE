"""
ShadowRep AI — AI Chat Module
Gemini-powered conversational intelligence endpoint.
"""

import aiosqlite
from fastapi import APIRouter

from database import DB_PATH
from models.chat_models import (
    ChatMessageRequest, ChatMessageResponse, ChatHistoryResponse,
)
from services import gemini_service

router = APIRouter()


@router.post("", response_model=ChatMessageResponse)
async def send_message(req: ChatMessageRequest):
    """Send a message and get an AI-powered response."""
    # Save user message to history
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO chat_history (sender, message) VALUES ('user', ?)",
            (req.message,)
        )

        # Build context from current competitor data
        db.row_factory = aiosqlite.Row
        comp_rows = await db.execute_fetchall("SELECT name, pricing_status, hiring_intent, cta_changes FROM competitors")
        context_lines = []
        for r in comp_rows:
            d = dict(r)
            context_lines.append(
                f"- {d['name']}: pricing={d['pricing_status']}, hiring={d['hiring_intent']}, CTA changes={d['cta_changes']}"
            )
        context = "Current competitor state:\n" + "\n".join(context_lines)

        # Get AI response
        ai_response = await gemini_service.chat(req.message, context)

        # Save AI response to history
        await db.execute(
            "INSERT INTO chat_history (sender, message) VALUES ('ai', ?)",
            (ai_response,)
        )
        await db.commit()

    return {"sender": "ai", "text": ai_response}


@router.get("/history", response_model=ChatHistoryResponse)
async def get_chat_history(limit: int = 50):
    """Get chat message history."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        rows = await db.execute_fetchall(
            "SELECT sender, message FROM chat_history ORDER BY id ASC LIMIT ?",
            (limit,)
        )
        messages = [
            {"sender": dict(r)["sender"], "text": dict(r)["message"]}
            for r in rows
        ]
        return {"messages": messages, "total": len(messages)}
