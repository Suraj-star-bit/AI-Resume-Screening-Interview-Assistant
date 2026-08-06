from pydantic import BaseModel
from datetime import datetime

class JobDescriptionCreate(BaseModel):
    title: str
    description: str

class JobDescriptionResponse(BaseModel):
    id: int
    title: str
    description: str
    created_at: datetime
    owner_id: int

    model_config = {
        "from_attributes": True
    }