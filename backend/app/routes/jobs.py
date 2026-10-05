from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_candidate
from app.models.user import User
from app.models.job_description import JobDescription


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


@router.get("/")
def get_available_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_candidate)
):
    jobs = (
        db.query(JobDescription)
        .order_by(JobDescription.id.desc())
        .all()
    )

    return jobs