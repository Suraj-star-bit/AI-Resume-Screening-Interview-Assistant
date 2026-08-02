from fastapi import FastAPI

from app.database import Base, engine
from app.models.user import User
from app.routes.user import router as user_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Resume Screening & Interview Assistant API"
)

app.include_router(user_router)


@app.get("/")
def root():
    return {
        "message": "AI Resume Screening & Interview Assistant Backend Running 🚀"
    }