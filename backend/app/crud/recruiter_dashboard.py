from sqlalchemy.orm import Session

from app.models.ats_result import ATSResult
from app.models.interview import Interview
from app.models.application import Application
from app.models.user import User


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

    applications = (
        db.query(Application)
        .filter(Application.job_id == job_id)
        .order_by(Application.id.desc())
        .all()
    )

    dashboard = []

    for application in applications:

        candidate = (
            db.query(User)
            .filter(User.id == application.candidate_id)
            .first()
        )

        result = (
            db.query(ATSResult)
            .filter(
                ATSResult.resume_id == application.resume_id,
                ATSResult.job_id == job_id
            )
            .order_by(ATSResult.id.desc())
            .first()
        )

        interview = (
            db.query(Interview)
            .filter(
                Interview.resume_id == application.resume_id,
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

        if result:
            final_result = calculate_final_recommendation(
                ats_score=result.score,
                interview_score=interview_score
            )

            ats_score = result.score
            matched_skills = result.matched_skills
            missing_skills = result.missing_skills
            ats_status = result.status

        else:
            final_result = {
                "final_score": None,
                "final_recommendation": "Pending ATS"
            }

            ats_score = None
            matched_skills = None
            missing_skills = None
            ats_status = "Pending"

        dashboard.append({
            "resume_id": application.resume_id,
            "candidate_id": application.candidate_id,
            "candidate_name": (
                candidate.name
                if candidate
                else None
            ),
            "candidate_email": (
                candidate.email
                if candidate
                else None
            ),
            "application_id": application.id,
            "application_status": application.status,
            "score": ats_score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "status": ats_status,
            "interview_score": interview_score,
            "recommendation": interview_recommendation,
            "final_score": final_result["final_score"],
            "final_recommendation": final_result["final_recommendation"]
        })

    return dashboard