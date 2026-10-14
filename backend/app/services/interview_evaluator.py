
import json
import os
import requests
from openai import OpenAI


def evaluate_answer(
    question: str,
    answer: str,
    job_skills: list[str]
):
    """Evaluate a candidate's interview answer using Groq or local Ollama."""

    if not answer.strip():
        return {
            "score": 0.0,
            "feedback": "The candidate did not provide an answer.",
            "recommendation": "Weak"
        }

    skills = ", ".join(job_skills)

    prompt = f"""
You are an expert technical interviewer.

Evaluate the candidate's answer.

QUESTION:
{question}

CANDIDATE ANSWER:
{answer}

REQUIRED JOB SKILLS:
{skills}

Evaluate based on:
1. Technical correctness
2. Understanding
3. Relevance
4. Practical experience
5. Clarity and completeness

Give a score from 0 to 10.

Return ONLY valid JSON in this format:
{{
    "score": 7,
    "feedback": "Brief explanation of strengths and weaknesses.",
    "recommendation": "Strong"
}}

Recommendation must be one of:
Strong
Needs Improvement
Weak
"""

    if os.getenv("GROQ_API_KEY"):
        client = OpenAI(
            api_key=os.getenv("GROQ_API_KEY"),
            base_url="https://api.groq.com/openai/v1"
        )

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert technical interviewer. "
                        "Return only valid JSON with score, feedback, "
                        "and recommendation."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        content = response.choices[0].message.content or ""

    else:
        response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "llama3.2",
                "messages": [
                    {
                        "role": "system",
                        "content": "Return only valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()
        content = response.json()["message"]["content"]

    content = content.strip()

    if content.startswith("```"):
        content = content.replace("```json", "")
        content = content.replace("```", "").strip()

    result = json.loads(content)

    score = float(result["score"])
    if not 0 <= score <= 10:
        raise ValueError("Interview score must be between 0 and 10.")

    recommendation = result["recommendation"]
    if recommendation not in {"Strong", "Needs Improvement", "Weak"}:
        recommendation = "Needs Improvement"

    return {
        "score": score,
        "feedback": str(result["feedback"]),
        "recommendation": recommendation
    }


def calculate_overall_score(scores: list[float]):
    """Calculate the overall interview score from individual question scores."""

    if not scores:
        return {
            "overall_score": 0.0,
            "recommendation": "Not Evaluated"
        }

    overall_score = sum(scores) / len(scores)

    if overall_score >= 8:
        recommendation = "Strong Candidate"
    elif overall_score >= 6:
        recommendation = "Needs Improvement"
    else:
        recommendation = "Weak Candidate"

    return {
        "overall_score": round(overall_score, 2),
        "recommendation": recommendation
    }
