import requests
import json


def evaluate_answer(
    question: str,
    answer: str,
    job_skills: list[str]
):
    """
    Evaluate a candidate's interview answer using Llama 3.2
    through Ollama.
    """

    if not answer.strip():
        return {
            "score": 0.0,
            "feedback": "The candidate did not provide an answer.",
            "recommendation": "Reject"
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

Evaluate the answer based on:
1. Technical correctness
2. Understanding of the topic
3. Relevance to the question
4. Practical experience
5. Clarity and completeness

Give a score from 0 to 10.

Return ONLY valid JSON in exactly this format:

{{
    "score": 7,
    "feedback": "Brief explanation of the candidate's strengths and weaknesses.",
    "recommendation": "Strong"
}}

Recommendation must be one of:
Strong
Needs Improvement
Weak
"""

    response = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": "llama3.2",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert technical interviewer. Return only valid JSON."
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

    content = data["message"]["content"].strip()

    # Remove markdown code fences if Llama adds them
    if content.startswith("```"):
        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()

    result = json.loads(content)

    return {
        "score": float(result["score"]),
        "feedback": result["feedback"],
        "recommendation": result["recommendation"]
    }


def calculate_overall_score(scores: list[float]):
    """
    Calculate the overall interview score
    from individual question scores.
    """

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