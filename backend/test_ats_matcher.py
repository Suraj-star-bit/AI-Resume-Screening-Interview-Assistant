from app.services.ats_matcher import calculate_skill_match


resume_skills = [
    "Python",
    "FastAPI",
    "Docker",
    "Git",
    "PostgreSQL",
    "REST API"
]

job_skills = [
    "AWS",
    "Docker",
    "FastAPI",
    "Git",
    "JWT",
    "Machine Learning",
    "PostgreSQL",
    "Python",
    "REST API",
    "SQLAlchemy"
]

result = calculate_skill_match(resume_skills, job_skills)

print("========== ATS RESULT ==========")
print("Score:", result["score"])
print("Matched:", result["matched_skills"])
print("Missing:", result["missing_skills"])
print("================================")