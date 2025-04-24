from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class SearchRequest(BaseModel):
    query: str

class AccountBase(BaseModel):
    username: str
    email: str
    handle: str

class AccountCreate(AccountBase):
    password: str

class AccountRead(AccountBase):
    id: int
    created_at: datetime
    tweets: List["TweetBase"] # <-- forward reference as a string

    class Config:
        orm_mode = True

class AccountCredentials(BaseModel):
    username: str
    password: str

from backend.schemas.tweet import TweetBase  # <-- "lazy import" to avoid circular referencing
AccountRead.model_rebuild()