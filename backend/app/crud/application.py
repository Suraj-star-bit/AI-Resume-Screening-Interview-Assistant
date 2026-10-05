from sqlalchemy.orm import Session

from app.models.application import Application


def create_application(
    db: Session,
    candidate_id: int,
    job_id: int,
    resume_id: int
):
    application = Application(
        candidate_id=candidate_id,
        job_id=job_id,
        resume_id=resume_id
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


def get_candidate_applications(
    db: Session,
    candidate_id: int
):
    return (
        db.query(Application)
        .filter(
            Application.candidate_id == candidate_id
        )
        .order_by(Application.id.desc())
        .all()
    )


def get_existing_application(
    db: Session,
    candidate_id: int,
    job_id: int
):
    return (
        db.query(Application)
        .filter(
            Application.candidate_id == candidate_id,
            Application.job_id == job_id
        )
        .first()
    )