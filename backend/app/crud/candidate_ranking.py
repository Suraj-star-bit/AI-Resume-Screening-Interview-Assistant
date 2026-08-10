from sqlalchemy.orm import Session

from app.models.ats_result import ATSResult


def get_ranked_candidates(db: Session, job_id: int):
    return (
        db.query(ATSResult)
        .filter(ATSResult.job_id == job_id)
        .order_by(ATSResult.score.desc())
        .all()
    )