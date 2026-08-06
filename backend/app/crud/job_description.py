from sqlalchemy.orm import Session

from app.models.job_description import JobDescription

def create_job_description(
    db: Session,
    title: str,
    description: str,
    owner_id: int
):
    new_job = JobDescription(
        title=title,
        description=description,
        owner_id=owner_id
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job