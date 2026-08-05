from sqlalchemy.orm import Session

from app.models.resume import Resume


def create_resume(
    db: Session,
    filename: str,
    file_path: str,
    owner_id: int
):
    new_resume = Resume(
        filename=filename,
        file_path=file_path,
        owner_id=owner_id
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return new_resume