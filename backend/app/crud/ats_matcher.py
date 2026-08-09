from sqlalchemy.orm import Session

from app.models.resume_skill import ResumeSkill
from app.models.job_skill import JobSkill


def get_resume_skills(db: Session, resume_id: int):
    skills = (
        db.query(ResumeSkill)
        .filter(ResumeSkill.resume_id == resume_id)
        .all()
    )

    return [skill.skill for skill in skills]


def get_job_skills(db: Session, job_id: int):
    skills = (
        db.query(JobSkill)
        .filter(JobSkill.job_id == job_id)
        .all()
    )

    return [skill.skill for skill in skills]