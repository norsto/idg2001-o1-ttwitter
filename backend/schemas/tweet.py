from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TweetBase(BaseModel):
    content: str
    #created_time: datetime <- this is not needed as it will be set by the server

class TweetCreate(TweetBase):
    hashtags: Optional[List[str]] = [] # List of hashtag strings (e.g., ["cats", "sigmagrindset"]
    media: Optional[List[str]] = [] # List of media URLs (e.g., ["https://example.com/image.jpg"])

class TweetRead(TweetBase):
    id: int
    created_at: datetime
    account_id: int
    hashtags: List[str] = []
    
    class Config:
        orm_mode = True