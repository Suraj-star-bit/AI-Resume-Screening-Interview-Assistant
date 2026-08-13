from sqlalchemy.orm import Session

from app.models.interview_question import InterviewQuestion


def create_interview_question(
    db: Session,
    interview_id: int,
    question: str,
    question_type: str
):
    new_question = InterviewQuestion(
        interview_id=interview_id,
        question=question,
        question_type=question_type
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)

    return new_question


def get_interview_questions(
    db: Session,
    interview_id: int
):
    return (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview_id
        )
        .order_by(InterviewQuestion.id.asc())
        .all()
    )