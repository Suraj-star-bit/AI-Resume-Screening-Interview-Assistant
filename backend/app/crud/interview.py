from sqlalchemy.orm import Session
from app.models.interview import Interview

def create_interview(db: Session, resume_id: int, job_id: int):

    interview = Interview(resume_id=resume_id, job_id=job_id , status="Not Started")

    db.add(interview)
    db.commit()
    db.refresh(interview)

    return interview
