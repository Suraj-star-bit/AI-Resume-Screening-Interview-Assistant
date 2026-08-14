from pydantic import BaseModel
from datetime import datetime


class InterviewQuestionCreate(BaseModel):
    interview_id: int
    question: str
    question_type: str


class InterviewQuestionResponse(BaseModel):
    id: int
    interview_id: int
    question: str
    question_type: str
    answer: str | None = None
    score: float | None = None
    feedback: str | None = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class InterviewAnswerCreate(BaseModel):
    answer: str