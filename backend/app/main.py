from fastapi import FastAPI

from app.database import Base, engine
from app.models.user import User
from app.routes.user import router as user_router
from app.routes.resume import router as resume_router
from app.routes.job_description import router as job_description_router
from app.models.job_description import JobDescription
from app.routes.ats import router as ats_router

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Resume Screening & Interview Assistant API"
)

app.include_router(user_router)
app.include_router(resume_router)
app.include_router(job_description_router)
app.include_router(ats_router)


@app.get("/")
def root():
    return {
        "message": "AI Resume Screening & Interview Assistant Backend Running 🚀"
    }