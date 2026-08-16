from openai import OpenAI
from app.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def get_interview_questions(
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
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an expert technical interviewer."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
    )

    content = response.choices[0].message.content

    if not content:
        return []

    questions = [
        line.strip()
        for line in content.split("\n")
        if line.strip()
    ]

    return questions