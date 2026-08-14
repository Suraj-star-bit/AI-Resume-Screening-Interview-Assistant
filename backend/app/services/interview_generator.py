from sqlalchemy.orm import Session

from app.models.interview import Interview
from app.models.resume import Resume
from app.models.job_description import JobDescription
from app.models.job_skill import JobSkill

def get_interview_context(
        db: Session,
        interview_id: int
):
    # Get Interview
    interview = (
        db.query(Interview).filter(Interview.id == interview_id).first()
    )

    if not interview:
        return None

    # Get Resume
    resume = (
        db.query(Resume).filter(Resume.id == interview.resume_id ).first()
    )

    #Get Job
    job = (
        db.query(JobDescription).filter(JobDescription.id == interview.job_id).first()
    )

    # Get required skills
    skills = (
        db.query(JobSkill.skill).filter(JobSkill.job_id == interview.job_id).all()
    )

    job_skills = [skill[0] for skill in skills]

    return {
        "interview_id": interview.id,
        "resume_id": interview.resume_id,
        "job_id": interview.job_id,
        "resume_text": resume.resume_text if resume else "",
        "job_title": job.title if job else "",
        "job_description": job.description if job else "",
        "job_skills": job_skills
    }