from datetime import datetime

from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    job_id: int
    resume_id: int


class ApplicationResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    resume_id: int
    status: str
    applied_at: datetime | None

    model_config = {
        "from_attributes": True
    }