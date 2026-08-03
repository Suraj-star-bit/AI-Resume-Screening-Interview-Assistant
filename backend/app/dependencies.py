from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.auth import verify_access_token
from app.database import SessionLocal
from app.models.user import User

from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials

security = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    email = verify_access_token(token)

    user = db.query(User).filter(User.email == email).first()

    return user