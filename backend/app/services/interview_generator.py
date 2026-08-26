from sqlalchemy.orm import Session

import requests

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




def generate_interview_questions(
    resume_text: str,
    job_title: str,
    job_description: str,
    job_skills: list[str]
):
    skills = ", ".join(job_skills)

    prompt = f"""
You are an expert technical interviewer.

Generate 5 interview questions for a candidate applying for this job.

JOB TITLE:
{job_title}

JOB DESCRIPTION:
{job_description}

REQUIRED SKILLS:
{skills}

CANDIDATE RESUME:
{resume_text}

Rules:
1. Questions must be personalized to the candidate's resume.
2. Focus on the required skills for the job.
3. Include technical and practical questions.
4. If the resume claims experience with a technology, ask about that experience.
5. If a required skill is missing from the resume, ask a question that tests that skill.
6. Do not provide answers.
7. Return only the questions, one per line.
"""

    response = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": "llama3.2",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert technical interviewer."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "stream": False
        }
    )

    response.raise_for_status()

    data = response.json()

    content = data["message"]["content"]

    questions = []

    for line in content.split("\n"):
        line = line.strip()

        if not line:
            continue

        if line.lower().startswith("here are"):
            continue

        if line[0].isdigit() and "." in line[:3]:
            line = line.split(".", 1)[1].strip()

        questions.append(line)

    return questions[:5]

def generate_mock_interview_questions(
    job_title: str,
    job_description: str,
    job_skills: list[str],
    resume_text: str
):
    questions = [
        f"Explain your experience with {job_skills[0] if job_skills else 'the technologies mentioned in this job description'}.",
        f"How have you used {job_skills[1] if len(job_skills) > 1 else 'backend technologies'} in a real project?",
        f"Describe a backend project from your resume and explain the technical decisions you made.",
        f"How would you design a production-ready backend system for the role of {job_title}?",
        f"Which required skill in this job would you like to improve, and how would you approach learning it?"
    ]

    return questions