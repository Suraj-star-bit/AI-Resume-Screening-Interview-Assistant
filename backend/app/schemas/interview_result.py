from pydantic import BaseModel
from datetime import datetime

from app.schemas.interview_question import InterviewQuestionResponse


class InterviewResultResponse(BaseModel):
    id: int
    resume_id: int
    job_id: int
    status: str
    overall_score: float | None = None
    recommendation: str | None = None
    created_at: datetime

    questions: list[InterviewQuestionResponse]