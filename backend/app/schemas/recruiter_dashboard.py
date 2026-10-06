from pydantic import BaseModel


class RecruiterCandidate(BaseModel):

    resume_id: int

    candidate_id: int | None

    candidate_name: str | None

    candidate_email: str | None

    application_id: int | None

    application_status: str | None

    score: float

    matched_skills: str | None

    missing_skills: str | None

    status: str

    interview_score: float | None

    recommendation: str | None

    final_score: float | None

    final_recommendation: str


class RecruiterDashboardResponse(BaseModel):

    job_id: int

    candidates: list[RecruiterCandidate]