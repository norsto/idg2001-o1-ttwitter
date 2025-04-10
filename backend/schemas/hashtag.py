from pydantic import BaseModel

class hashtagBase(BaseModel):
    tag: str

class hashtagCreate(hashtagBase):