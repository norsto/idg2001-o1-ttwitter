from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from .hashtag import HashtagRead
from .media import MediaRead
from .account import AccountMinimal

class SearchRequest(BaseModel):
    query: str

class TweetBase(BaseModel):
    content: str
    #created_time: datetime <- this is not needed as it will be set by the server

class TweetCreate(TweetBase):
    hashtags: Optional[List[str]] = [] # List of hashtag strings (e.g., ["cats", "sigmagrindset"]
    media: Optional[List[str]] = [] # List of media URLs (e.g., ["https://example.com/image.jpg"])
# changed account_id from int to AccountRead
class TweetRead(TweetBase):
    id: int
    created_at: datetime
    account: AccountMinimal
    hashtags: List[HashtagRead] = []
    media: List[MediaRead] = []
    
    class Config:
        orm_mode = True

class TweetUpdate(BaseModel):
    content: Optional[str] = None 
    hashtags: Optional[List[str]] = None
    media: Optional[List[str]] = None 
    # exclude_unset=True when applying it so only fields provided get updated