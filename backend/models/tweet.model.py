from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
from app.models.association import tweet_hashtag_table

class Tweet(Base):
    __tablename__ = 'tweets'

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    account_id = Column(Integer, ForeignKey('accounts.id'), nullable=False)
    account = relationship("Account", back_populates="tweets")

    hashtags = relationship(
        "Hashtag",
        secondary=tweet_hashtag_table,
        back_populates="tweets"
    )

    media = relationship(
        "Media",
        back_populates="tweet",
        cascade="all, delete"
    )
