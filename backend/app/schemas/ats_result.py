from pydantic import BaseModel
from datetime import datetime


class ATSResultResponse(BaseModel):
    id: int
    resume_id: int
    job_id: int
    score: float
    matched_skills: str | None
    missing_skills: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }