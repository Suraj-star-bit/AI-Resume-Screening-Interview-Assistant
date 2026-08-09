from app.database import SessionLocal
from app.crud.ats_matcher import get_resume_skills, get_job_skills
from app.services.ats_matcher import calculate_skill_match


db = SessionLocal()

resume_skills = get_resume_skills(db, resume_id=9)
job_skills = get_job_skills(db, job_id=3)

result = calculate_skill_match(
    resume_skills,
    job_skills
)

print("========== ATS RESULT ==========")
print("Score:", result["score"])
print("Matched Skills:", result["matched_skills"])
print("Missing Skills:", result["missing_skills"])
print("================================")

db.close()