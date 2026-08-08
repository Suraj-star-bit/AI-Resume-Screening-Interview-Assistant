from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User

from app.crud.job_description import create_job_description
from app.schemas.job_description import (
    JobDescriptionCreate,
    JobDescriptionResponse
)
from app.utils.resume_parser import extract_job_skills
from app.crud.job_skill import create_job_skill

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

    # Extract required skills
    skills = extract_job_skills(job.description)

    print("\n========== JOB DESCRIPTION ==========")
    print("Title:", job.title)
    print("Required Skills:", skills)
    print("=====================================\n")

    # Create the job first
    new_job = create_job_description(
        db=db,
        title=job.title,
        description=job.description,
        owner_id=current_user.id
    )

    # Save each required skill
    for skill in skills:
        create_job_skill(
            db=db,
            job_id=new_job.id,
            skill=skill
        )

    return new_job