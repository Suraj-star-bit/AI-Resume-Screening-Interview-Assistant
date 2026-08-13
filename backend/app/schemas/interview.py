from pydantic import BaseModel
from datetime import datetime

class InterviewCreate(BaseModel):
    resume_id : int
    job_id : int


class InterviewResponse(BaseModel):
    id: int
    resume_id: int
    job_id: int
    status: str
    overall_score: float | None = None
    recommendation: str | None = None
    created_at: datetime

    model_config = {
        "from_attribute":True
    }