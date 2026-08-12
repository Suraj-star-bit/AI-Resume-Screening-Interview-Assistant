from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.models.user import User
from app.routes.user import router as user_router
from app.routes.resume import router as resume_router
from app.routes.job_description import router as job_description_router
from app.models.job_description import JobDescription
from app.routes.ats import router as ats_router
from app.routes.candidate_ranking import router as candidate_ranking_router
from app.routes.recruiter_dashboard import router as recruiter_dashboard_router
from app.routes.candidate_details import router as candidate_details_router
from app.routes.candidate_status import router as candidate_status_router

from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)


app = FastAPI()

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(user_router)
app.include_router(resume_router)
app.include_router(job_description_router)
app.include_router(ats_router)
app.include_router(candidate_ranking_router)
app.include_router(recruiter_dashboard_router)
app.include_router(candidate_details_router)
app.include_router(candidate_status_router)


@app.get("/")
def root():
    return {
        "message": "AI Resume Screening & Interview Assistant Backend Running 🚀"
    }