from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_candidate
from app.models.user import User
from app.models.job_description import JobDescription
from app.models.resume import Resume

from app.crud.application import (
    create_application,
    get_candidate_applications,
    get_existing_application
)

from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse
)


router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


@router.post(
    "/",
    response_model=ApplicationResponse
)
def apply_for_job(
    data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_candidate)
):
    # Check job exists
    job = (
        db.query(JobDescription)
        .filter(JobDescription.id == data.job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Check resume exists and belongs to candidate
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == data.resume_id,
            Resume.owner_id == current_user.id
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found or does not belong to you"
        )

    # Prevent duplicate application
    existing = get_existing_application(
        db=db,
        candidate_id=current_user.id,
        job_id=data.job_id
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have already applied for this job"
        )

    # Create application
    application = create_application(
        db=db,
        candidate_id=current_user.id,
        job_id=data.job_id,
        resume_id=data.resume_id
    )

    return application


@router.get(
    "/my",
    response_model=list[ApplicationResponse]
)
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_candidate)
):
    return get_candidate_applications(
        db=db,
        candidate_id=current_user.id
    )