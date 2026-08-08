from sqlalchemy import Column, Integer, String, ForeignKey

from app.database import Base


class JobSkill(Base):
    __tablename__ = "job_skills"

    id = Column(Integer, primary_key=True, index=True)

    job_id = Column(
        Integer,
        ForeignKey("job_descriptions.id"),
        nullable=False
    )

    skill = Column(String, nullable=False)