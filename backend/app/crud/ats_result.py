from sqlalchemy.orm import Session

from app.models.ats_result import ATSResult


def create_ats_result(
    db: Session,
    resume_id: int,
    job_id: int,
    score: float,
    matched_skills: str,
    missing_skills: str
):
    new_result = ATSResult(
        resume_id=resume_id,
        job_id=job_id,
        score=score,
        matched_skills=matched_skills,
        missing_skills=missing_skills
    )

    db.add(new_result)
    db.commit()
    db.refresh(new_result)

    return new_result