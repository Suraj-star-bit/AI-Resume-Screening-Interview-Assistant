from sqlalchemy.orm import Session

from app.models.ats_result import ATSResult


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

    db.commit()
    db.refresh(result)

    return result