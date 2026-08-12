from sqlalchemy.orm import Session

from app.models.resume import Resume


def create_resume(
    db: Session,
    filename: str,
    file_path: str,
    resume_text: str,
    email: str,
    owner_id: int
):
    new_resume = Resume(
        filename=filename,
        file_path=file_path,
        resume_text=resume_text,
        email=email,
        owner_id=owner_id
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return new_resume

def get_resume(db: Session, resume_id: int):
    return (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )