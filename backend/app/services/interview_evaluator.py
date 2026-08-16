def evaluate_answer(
    question: str,
    answer: str,
    job_skills: list[str]
):
    """
    Evaluate a candidate's interview answer
    using simple rule-based logic.
    """

    # Make everything lowercase so comparison is easier
    question_lower = question.lower()
    answer_lower = answer.lower()

    score = 0
    feedback = []

    # 1. Check whether the candidate actually answered
    if not answer.strip():
        return {
            "score": 0,
            "feedback": "The candidate did not provide an answer.",
            "recommendation": "Reject"
        }

    # 2. Check answer length
    word_count = len(answer.split())

    if word_count >= 30:
        score += 3
        feedback.append("The answer provides sufficient detail.")
    elif word_count >= 10:
        score += 2
        feedback.append("The answer provides some detail.")
    else:
        score += 1
        feedback.append("The answer is very brief.")

    # 3. Check whether required job skills appear
    matched_skills = []

    for skill in job_skills:
        if skill.lower() in answer_lower:
            matched_skills.append(skill)

    if matched_skills:
        score += 4
        feedback.append(
            f"The answer mentions relevant skills: "
            f"{', '.join(matched_skills)}."
        )
    else:
        feedback.append(
            "The answer does not mention any of the required job skills."
        )

    # 4. Check whether the candidate acknowledges missing experience
    negative_phrases = [
        "i have not",
        "i don't have",
        "no experience",
        "not used",
        "haven't used"
    ]

    admits_missing_experience = any(
        phrase in answer_lower
        for phrase in negative_phrases
    )

    if admits_missing_experience:
        feedback.append(
            "The candidate openly acknowledges limited experience "
            "with the technology."
        )

    # 5. Final score
    if score >= 7:
        recommendation = "Strong"
    elif score >= 5:
        recommendation = "Needs Improvement"
    else:
        recommendation = "Weak"

    return {
        "score": float(score),
        "feedback": " ".join(feedback),
        "recommendation": recommendation
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