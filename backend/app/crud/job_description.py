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


def get_jobs_by_owner(
    db: Session,
    owner_id: int
):
    return (
        db.query(JobDescription)
        .filter(JobDescription.owner_id == owner_id)
        .order_by(JobDescription.id.desc())
        .all()
    )