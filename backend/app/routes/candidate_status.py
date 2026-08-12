from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.crud.candidate_status import update_candidate_status
from app.schemas.candidate_status import CandidateStatusUpdate


router = APIRouter(
    prefix="/candidates",
    tags=["Candidate Status"]
)


@router.patch("/{resume_id}/status")
def change_candidate_status(
    resume_id: int,
    job_id: int,
    data: CandidateStatusUpdate,
    db: Session = Depends(get_db)
):
    allowed_statuses = [
        "Review",
        "Shortlisted",
        "Rejected",
        "Interview"
    ]

    if data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid candidate status"
        )

    result = update_candidate_status(
        db=db,
        resume_id=resume_id,
        job_id=job_id,
        status=data.status
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="ATS result not found"
        )

    return {
        "message": "Candidate status updated successfully",
        "resume_id": resume_id,
        "job_id": job_id,
        "status": result.status
    }