from app.database import SessionLocal
from app.crud.ats_matcher import get_resume_skills, get_job_skills


db = SessionLocal()

resume_skills = get_resume_skills(db, resume_id=9)
job_skills = get_job_skills(db, job_id=3)

print("========== DATABASE DATA ==========")
print("Resume Skills:", resume_skills)
print("Job Skills:", job_skills)
print("===================================")

db.close()