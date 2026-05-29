"""Chat Pydantic models — request/response schemas."""

from pydantic import BaseModel
from typing import Literal


class ChatMessageRequest(BaseModel):
    message: str


class ChatMessageResponse(BaseModel):
    sender: Literal["user", "ai"]
    text: str


class ChatHistoryResponse(BaseModel):
    messages: list[ChatMessageResponse]
    total: int
