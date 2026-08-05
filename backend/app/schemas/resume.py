from pydantic import BaseModel
from datetime import datetime


class ResumeResponse(BaseModel):
    id: int
    filename: str
    file_path: str
    uploaded_at: datetime
    owner_id: int

    model_config = {
        "from_attributes": True
    }