from app.utils.resume_parser import extract_job_skills


job_description = """
Looking for a Python Backend Developer with FastAPI,
PostgreSQL, SQLAlchemy, Docker, Git, REST API,
JWT Authentication, AWS and Machine Learning experience.
"""

skills = extract_job_skills(job_description)

print("Job Skills:")
print(skills)