from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.crud.recruiter_dashboard import get_recruiter_dashboard
from app.schemas.recruiter_dashboard import RecruiterDashboardResponse

router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter Dashboard"]
)


@router.get(
    "/dashboard",
    response_model=RecruiterDashboardResponse
)
def recruiter_dashboard(
    job_id: int,
    db: Session = Depends(get_db)
):
    results = get_recruiter_dashboard(
        db=db,
        job_id=job_id
    )

    candidates = [
    {
        "resume_id": result["resume_id"],
        "score": result["score"],
        "matched_skills": result["matched_skills"],
        "missing_skills": result["missing_skills"],
        "status": result["status"],
        "interview_score": result["interview_score"],
        "recommendation": result["recommendation"]
    }
    for result in results
]

    return {
        "job_id": job_id,
        "candidates": candidates
    }