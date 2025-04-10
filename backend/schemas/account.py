from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class AccountBase(BaseModel):
    username: str
    email: str

class AccountCreate(AccountBase):
    password: str

class AccountRead(AccountBase):
    id: int
    created_at: datetime
    tweets: List[int] = [] # List of tweet IDs (e.g., ["1", "2", "3"])

    class Config:
        orm_mode = True