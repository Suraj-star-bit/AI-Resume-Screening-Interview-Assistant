from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.crud.interview_question import (
    create_interview_question,
    get_interview_questions,
    submit_answer
)
from app.schemas.interview_question import (
    InterviewQuestionCreate,
    InterviewQuestionResponse,
    InterviewAnswerCreate
)
from app.services.interview_evaluator import evaluate_answer
from app.models.interview_question import InterviewQuestion
from app.models.interview import Interview
from app.models.job_skill import JobSkill


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

@router.post(
    "/{question_id}/answer",
    response_model=InterviewQuestionResponse
)
def submit_question_answer(
    question_id: int,
    data: InterviewAnswerCreate,
    db: Session = Depends(get_db)
):
    question = submit_answer(
        db=db,
        question_id=question_id,
        answer=data.answer
    )

    if not question:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Interview question not found"
        )

    return question

@router.post(
    "/{question_id}/evaluate",
    response_model=InterviewQuestionResponse
)
def evaluate_question(
    question_id: int,
    db: Session = Depends(get_db)
):
    # Find the question
    question = (
        db.query(InterviewQuestion)
        .filter(InterviewQuestion.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Interview question not found"
        )

    # Make sure the candidate has answered
    if not question.answer:
        raise HTTPException(
            status_code=400,
            detail="Candidate has not answered this question yet"
        )

    # Find the interview
    interview = (
        db.query(Interview)
        .filter(Interview.id == question.interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    # Get required job skills
    skills = (
        db.query(JobSkill.skill)
        .filter(JobSkill.job_id == interview.job_id)
        .all()
    )

    job_skills = [skill[0] for skill in skills]

    # Evaluate the answer
    result = evaluate_answer(
        question=question.question,
        answer=question.answer,
        job_skills=job_skills
    )

    # Save evaluation
    question.score = result["score"]
    question.feedback = result["feedback"]

    db.commit()
    db.refresh(question)

    return question