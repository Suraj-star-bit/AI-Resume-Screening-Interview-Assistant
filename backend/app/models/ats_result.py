from sqlalchemy import Column, Integer, Float, Text, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database import Base


class ATSResult(Base):
    __tablename__ = "ats_results"

    id = Column(Integer, primary_key=True, index=True)

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id"),
        nullable=False
    )

    job_id = Column(
        Integer,
        ForeignKey("job_descriptions.id"),
        nullable=False
    )

    score = Column(Float, nullable=False)

    matched_skills = Column(Text, nullable=True)

    missing_skills = Column(Text, nullable=True)
    status = Column(String, default="Review")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )