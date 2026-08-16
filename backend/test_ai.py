from app.services.interview_generator import generate_interview_questions


questions = generate_interview_questions(
    resume_text="""
Jake Ryan
Developed a REST API using FastAPI and PostgreSQL.
Developed a full-stack web application using Flask, React,
PostgreSQL and Docker.
""",

    job_title="Python Backend Developer",

    job_description="""
We are looking for a Python Backend Developer with experience
in Python, FastAPI, PostgreSQL, REST APIs, Docker, Git and AWS.

Responsibilities include developing REST APIs, building backend
services, working with PostgreSQL databases, Docker deployment
and AWS.
""",

    job_skills=[
        "AWS",
        "Docker",
        "FastAPI",
        "Git",
        "PostgreSQL",
        "Python"
    ]
)


print("\n========== AI GENERATED QUESTIONS ==========\n")

for i, question in enumerate(questions, start=1):
    print(f"{i}. {question}")

print("\n============================================")