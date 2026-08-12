from pydantic import BaseModel


class CandidateStatusUpdate(BaseModel):
    status: str