from sqlalchemy.orm import Session
from app.models.interview import Interview


def create_interview(db: Session, resume_id: int, job_id: int):

    # Check if an interview already exists for this candidate and job
    existing_interview = (
        db.query(Interview)
        .filter(
            Interview.resume_id == resume_id,
            Interview.job_id == job_id
        )
        .order_by(Interview.id.desc())
        .first()
    )

    # Reuse the existing interview instead of creating a duplicate
    if existing_interview:
        return existing_interview

    # Create a new interview
    interview = Interview(
        resume_id=resume_id,
        job_id=job_id,
        status="Not Started"
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    return interview