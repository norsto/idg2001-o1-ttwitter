from pydantic import BaseModel

class hashtagBase(BaseModel):
    name: str

class hashtagCreate(hashtagBase):
    