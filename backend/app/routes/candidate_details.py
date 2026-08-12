from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.crud.candidate_details import get_candidate_details
from app.schemas.candidate_details import CandidateDetailsResponse


router = APIRouter(
    prefix="/candidates",
    tags=["Candidate Details"]
)


@router.get(
    "/{resume_id}",
    response_model=CandidateDetailsResponse
)
def candidate_details(
    resume_id: int,
    job_id: int,
    db: Session = Depends(get_db)
):
    resume, ats_result = get_candidate_details(
        db=db,
        resume_id=resume_id,
        job_id=job_id
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    if not ats_result:
        raise HTTPException(
            status_code=404,
            detail="ATS result not found for this job"
        )

    return {
        "resume_id": resume.id,
        "filename": resume.filename,
        "email": resume.email,
        "score": ats_result.score,
        "matched_skills": ats_result.matched_skills,
        "missing_skills": ats_result.missing_skills,
        "status": ats_result.status
    }