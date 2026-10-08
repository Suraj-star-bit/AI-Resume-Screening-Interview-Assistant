from sqlalchemy.orm import Session

from app.models.ats_result import ATSResult
from app.models.application import Application


def update_candidate_status(
    db: Session,
    resume_id: int,
    job_id: int,
    status: str
):
    result = (
        db.query(ATSResult)
        .filter(
            ATSResult.resume_id == resume_id,
            ATSResult.job_id == job_id
        )
        .first()
    )

    if not result:
        return None

    result.status = status

    application = (
        db.query(Application)
        .filter(
            Application.resume_id == resume_id,
            Application.job_id == job_id
        )
        .first()
    )

    if application:
        application.status = status

    db.commit()
    db.refresh(result)

    return result