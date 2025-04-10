from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(255), nullable=False)  # Path to the media file
    media_type = Column(String(20), nullable=False)  # 'image', 'video', etc.
    tweet_id = Column(Integer, ForeignKey("tweets.id"), nullable=False)

    tweet = relationship("Tweet", back_populates="media")
