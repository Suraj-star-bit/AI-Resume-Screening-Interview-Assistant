from sqlalchemy.orm import Session

from app.models.resume_skill import ResumeSkill


def create_resume_skill(
    db: Session,
    resume_id: int,
    skill: str
):
    new_skill = ResumeSkill(
        resume_id=resume_id,
        skill=skill
    )

    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)

    return new_skill