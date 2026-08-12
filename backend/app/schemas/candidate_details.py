from pydantic import BaseModel


class CandidateDetailsResponse(BaseModel):
    resume_id: int
    filename: str
    email: str | None = None
    score: float | None = None
    matched_skills: str | None = None
    missing_skills: str | None = None
    status: str | None = None
    