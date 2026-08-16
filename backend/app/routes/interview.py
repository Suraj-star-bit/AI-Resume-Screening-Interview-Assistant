from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.crud.interview import create_interview
from app.crud.interview_question import get_interview_questions

from app.services.interview_generator import (
    get_interview_context,
    generate_mock_interview_questions
)

from app.services.interview_evaluator import (
    calculate_overall_score
)

from app.models.interview import Interview

from app.schemas.interview import (
    InterviewCreate,
    InterviewResponse
)
from app.schemas.interview_result import InterviewResultResponse
from app.schemas.interview_question import InterviewQuestionResponse


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


@router.post(
    "/{interview_id}/generate-questions",
    response_model=list[InterviewQuestionResponse]
)
def generate_questions(
    interview_id: int,
    db: Session = Depends(get_db)
):
    # Get interview context
    context = get_interview_context(
        db=db,
        interview_id=interview_id
    )

    if not context:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    # Generate questions
    questions = generate_mock_interview_questions(
        job_title=context["job_title"],
        job_description=context["job_description"],
        job_skills=context["job_skills"],
        resume_text=context["resume_text"]
    )

    # Save questions
    saved_questions = []

    for question in questions:
        saved_question = create_interview_question(
            db=db,
            interview_id=interview_id,
            question=question,
            question_type="Technical"
        )

        saved_questions.append(saved_question)

    return saved_questions

@router.post(
    "/{interview_id}/evaluate",
    response_model=InterviewResponse
)
def evaluate_interview(
    interview_id: int,
    db: Session = Depends(get_db)
):
    # 1. Find the interview
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    # 2. Get all questions for this interview
    questions = get_interview_questions(
        db=db,
        interview_id=interview_id
    )

    # 3. Get scores from evaluated questions
    scores = [
        question.score
        for question in questions
        if question.score is not None
    ]

    # 4. Make sure at least one question was evaluated
    if not scores:
        raise HTTPException(
            status_code=400,
            detail="No evaluated questions found"
        )

    # 5. Calculate overall score
    result = calculate_overall_score(scores)

    # 6. Save result to interviews table
    interview.overall_score = result["overall_score"]
    interview.recommendation = result["recommendation"]
    interview.status = "Completed"

    # 7. Save changes
    db.commit()
    db.refresh(interview)

    # 8. Return completed interview
    return interview

@router.get(
    "/{interview_id}",
    response_model=InterviewResponse
)
def get_interview(
    interview_id: int,
    db: Session = Depends(get_db)
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    return interview

@router.get(
    "/{interview_id}/result",
    response_model=InterviewResultResponse
)
def get_interview_result(
    interview_id: int,
    db: Session = Depends(get_db)
):
    # Find the interview
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    # Get all questions belonging to this interview
    questions = get_interview_questions(
        db=db,
        interview_id=interview_id
    )

    return {
        "id": interview.id,
        "resume_id": interview.resume_id,
        "job_id": interview.job_id,
        "status": interview.status,
        "overall_score": interview.overall_score,
        "recommendation": interview.recommendation,
        "created_at": interview.created_at,
        "questions": questions
    }