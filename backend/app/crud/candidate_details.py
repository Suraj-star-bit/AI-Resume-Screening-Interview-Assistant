from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.ats_result import ATSResult


def get_candidate_details(
    db: Session,
    resume_id: int,
    job_id: int
):
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )

    ats_result = (
        db.query(ATSResult)
        .filter(
            ATSResult.resume_id == resume_id,
            ATSResult.job_id == job_id
        )
        .first()
    )

    return resume, ats_result