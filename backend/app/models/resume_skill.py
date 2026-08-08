from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class ResumeSkill(Base):
    __tablename__ = "resume_skills"

    id = Column(Integer, primary_key=True, index=True)

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id"),
        nullable=False
    )

    skill = Column(String, nullable=False)