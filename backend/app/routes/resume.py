from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import os
import shutil

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.crud.resume import create_resume
from app.schemas.resume import ResumeResponse
from app.utils.pdf_parser import extract_text_from_pdf
from app.utils.resume_parser import (
    extract_email,
    extract_phone,
    extract_skills,
    extract_education,
    extract_experience
)
from app.crud.resume_skill import create_resume_skill


router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"]
)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload", response_model=ResumeResponse)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    #extract text from the pdf file
    resume_text = extract_text_from_pdf(file_path)
    email = extract_email(resume_text)
    phone = extract_phone(resume_text)
    skills = extract_skills(resume_text)
    education = extract_education(resume_text)
    experience = extract_experience(resume_text)

    print("========== PARSED DATA ==========")
    print("Email:", email)
    print("Phone:", phone)
    print("Skills:", skills)
    print("Education:", education)
    print("Experience:", experience)
    print("=================================")

    resume = create_resume(
    db=db,
    filename=file.filename,
    file_path=file_path,
    resume_text=resume_text,
    email=email,
    owner_id=current_user.id
)

    for skill in skills:
        create_resume_skill(
            db=db,
            resume_id=resume.id,
            skill=skill
        )

    return resume