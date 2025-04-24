from pydantic import BaseModel
from typing import List

class SearchRequest(BaseModel):
    query: str

class HashtagBase(BaseModel):
    tag: str

class HashtagCreate(HashtagBase):
    pass

class HashtagRead(HashtagBase):
    id: int
    tag: str

    class Config:
        orm_mode = True