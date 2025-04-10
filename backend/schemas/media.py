from pydantic import BaseModel

class MediaBase(BaseModel):
    media_type: str

class MediaCreate(MediaBase):
    url: str

class MediaRead(MediaBase):
    id: int
    tweet_id: int

    class Config:
        orm_mode = True