from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User

from app.crud.job_description import create_job_description
from app.schemas.job_description import (
    JobDescriptionCreate,
    JobDescriptionResponse
)

router = APIRouter(
    prefix="/job-descriptions",
    tags=["Job Descriptions"]
)

@router.post(
    "/",
    response_model=JobDescriptionResponse
)
def create_job(
    job: JobDescriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_job_description(
        db=db,
        title=job.title,
        description=job.description,
        owner_id=current_user.id
    )