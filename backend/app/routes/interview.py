from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.crud.interview import create_interview
from app.schemas.interview import (
    InterviewCreate,
    InterviewResponse
)


router = APIRouter(
    prefix="/interviews",
    tags=["Interviews"]
)


@router.post(
    "/",
    response_model=InterviewResponse
)
def start_interview(
    data: InterviewCreate,
    db: Session = Depends(get_db)
):
    return create_interview(
        db=db,
        resume_id=data.resume_id,
        job_id=data.job_id
    )