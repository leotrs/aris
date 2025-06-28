"""Pydantic models for copilot chat functionality."""

from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    """A single chat message with role and content."""
    
    role: str = Field(..., description="The role of the message sender (user, assistant)")
    content: str = Field(..., description="The content of the message")


class ChatContext(BaseModel):
    """Optional context for the chat request."""
    
    manuscript_content: Optional[str] = Field(None, description="Current manuscript content")
    file_id: Optional[int] = Field(None, description="ID of the current file")
    selection: Optional[str] = Field(None, description="Selected text in the editor")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional context metadata")


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    
    message: str = Field(..., min_length=1, max_length=10000, description="User message")
    context: Optional[ChatContext] = Field(None, description="Optional manuscript context")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "message": "Help me improve the clarity of this abstract",
                "context": {
                    "manuscript_content": "This paper presents a novel approach...",
                    "file_id": 123,
                    "selection": "novel approach to machine learning"
                }
            }
        }
    }


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    
    message: str = Field(..., description="Original user message")
    response: str = Field(..., description="AI assistant response")
    context_used: bool = Field(False, description="Whether manuscript context was used")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "message": "Help me improve the clarity of this abstract",
                "response": "Here are some suggestions to improve your abstract...",
                "context_used": True
            }
        }
    }