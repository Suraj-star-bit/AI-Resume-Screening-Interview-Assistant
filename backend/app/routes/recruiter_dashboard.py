from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_recruiter
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
    db: Session = Depends(get_db),
    current_user = Depends(get_current_recruiter)
):
    results = get_recruiter_dashboard(
        db=db,
        job_id=job_id
    )

    candidates = [
    {
        "resume_id": result["resume_id"],
        "candidate_id": result["candidate_id"],
        "candidate_name": result["candidate_name"],
        "candidate_email": result["candidate_email"],
        "application_id": result["application_id"],
        "application_status": result["application_status"],
        "score": result["score"],
        "matched_skills": result["matched_skills"],
        "missing_skills": result["missing_skills"],
        "status": result["status"],
        "interview_score": result["interview_score"],
        "recommendation": result["recommendation"],
        "final_score": result["final_score"],
        "final_recommendation": result["final_recommendation"]
    }
    for result in results
]

    return {
        "job_id": job_id,
        "candidates": candidates
    }