from sqlalchemy.orm import Session

from app.models.ats_result import ATSResult
from app.models.interview import Interview


def calculate_final_recommendation(
    ats_score: float,
    interview_score: float | None
):
    """
    Calculate the final candidate recommendation.

    ATS contributes 60%.
    Interview contributes 40%.
    """

    if interview_score is None:
        return {
            "final_score": None,
            "final_recommendation": "Pending Interview"
        }

    interview_percentage = interview_score * 10

    final_score = (
        ats_score * 0.60
        + interview_percentage * 0.40
    )

    final_score = round(final_score, 2)

    if final_score >= 80:
        recommendation = "Recommended"
    elif final_score >= 65:
        recommendation = "Review"
    else:
        recommendation = "Reject"

    return {
        "final_score": final_score,
        "final_recommendation": recommendation
    }


def get_recruiter_dashboard(db: Session, job_id: int):

    results = (
        db.query(ATSResult)
        .filter(ATSResult.job_id == job_id)
        .order_by(ATSResult.score.desc())
        .all()
    )

    dashboard = []

    for result in results:

        interview = (
            db.query(Interview)
            .filter(
                Interview.resume_id == result.resume_id,
                Interview.job_id == job_id,
                Interview.status == "Completed"
            )
            .order_by(Interview.id.desc())
            .first()
        )

        interview_score = (
            interview.overall_score
            if interview
            else None
        )

        interview_recommendation = (
            interview.recommendation
            if interview
            else None
        )

        final_result = calculate_final_recommendation(
            ats_score=result.score,
            interview_score=interview_score
        )

        dashboard.append({
            "resume_id": result.resume_id,
            "score": result.score,
            "matched_skills": result.matched_skills,
            "missing_skills": result.missing_skills,
            "status": result.status,
            "interview_score": interview_score,
            "recommendation": interview_recommendation,
            "final_score": final_result["final_score"],
            "final_recommendation": final_result["final_recommendation"]
        })

    return dashboard