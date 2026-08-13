from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.crud.interview_question import (
    create_interview_question,
    get_interview_questions
)
from app.schemas.interview_question import (
    InterviewQuestionCreate,
    InterviewQuestionResponse
)


router = APIRouter(
    prefix="/interview-questions",
    tags=["Interview Questions"]
)


@router.post(
    "/",
    response_model=InterviewQuestionResponse
)
def create_question(
    data: InterviewQuestionCreate,
    db: Session = Depends(get_db)
):
    return create_interview_question(
        db=db,
        interview_id=data.interview_id,
        question=data.question,
        question_type=data.question_type
    )


@router.get(
    "/{interview_id}",
    response_model=list[InterviewQuestionResponse]
)
def get_questions(
    interview_id: int,
    db: Session = Depends(get_db)
):
    return get_interview_questions(
        db=db,
        interview_id=interview_id
    )