from pydantic import BaseModel
from typing import List

class hashtagBase(BaseModel):
    tag: str

class hashtagCreate(hashtagBase):
    pass

class hashtagRead(hashtagBase):
    id: int
    tweets: List[int] = [] # List of tweet IDs (e.g., ["1", "2", "3"]) 

    class Config:
        orm_mode = True