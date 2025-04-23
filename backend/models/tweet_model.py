from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from zoneinfo import ZoneInfo
from backend.database import Base
from .association_model import tweet_hashtag_table

class Tweet(Base):
    __tablename__ = 'tweets'

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(ZoneInfo('UTC')))

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

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "created_at": int(self.created_at.timestamp() * 1000),
            "account_id": self.account_id
        }