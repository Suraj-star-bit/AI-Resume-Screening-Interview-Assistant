from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.crud.ats_matcher import get_resume_skills, get_job_skills
from app.crud.ats_result import create_ats_result
from app.services.ats_matcher import calculate_skill_match
from app.schemas.ats_result import ATSResultResponse

router = APIRouter(
    prefix="/ats",
    tags=["ATS"]
)


@router.get("/match", response_model=ATSResultResponse)
def match_resume_to_job(
    resume_id: int,
    job_id: int,
    db: Session = Depends(get_db)
):
    resume_skills = get_resume_skills(db, resume_id)
    job_skills = get_job_skills(db, job_id)

    result = calculate_skill_match(
        resume_skills,
        job_skills
    )

    matched_skills = ", ".join(result["matched_skills"])
    missing_skills = ", ".join(result["missing_skills"])

    saved_result = create_ats_result(
        db=db,
        resume_id=resume_id,
        job_id=job_id,
        score=result["score"],
        matched_skills=matched_skills,
        missing_skills=missing_skills
    )

    return saved_result