from sqlalchemy.orm import Session

from app.models.job_skill import JobSkill


def create_job_skill(
    db: Session,
    job_id: int,
    skill: str
):
    new_skill = JobSkill(
        job_id=job_id,
        skill=skill
    )

    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)

    return new_skill