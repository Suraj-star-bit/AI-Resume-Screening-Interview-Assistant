from sqlalchemy.orm import Session

from app.models.ats_result import ATSResult
from app.models.interview import Interview


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

        dashboard.append({
            "resume_id": result.resume_id,
            "score": result.score,
            "matched_skills": result.matched_skills,
            "missing_skills": result.missing_skills,
            "status": result.status,
            "interview_score": (
                interview.overall_score
                if interview
                else None
            ),
            "recommendation": (
                interview.recommendation
                if interview
                else None
            )
        })

    return dashboard