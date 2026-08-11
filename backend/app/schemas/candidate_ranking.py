from pydantic import BaseModel


from pydantic import BaseModel


class CandidateRankingResponse(BaseModel):
    resume_id: int
    job_id: int
    score: float
    matched_skills: str | None
    missing_skills: str | None
    status: str