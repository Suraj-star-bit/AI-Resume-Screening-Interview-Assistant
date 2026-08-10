from pydantic import BaseModel


class RecruiterCandidate(BaseModel):
    resume_id: int
    score: float
    matched_skills: str | None
    missing_skills: str| None


class RecruiterDashboardResponse(BaseModel):
    job_id: int
    candidates: list[RecruiterCandidate]