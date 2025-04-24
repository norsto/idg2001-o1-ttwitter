from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.database import Base
from .association_model import tweet_hashtag_table

class Hashtag(Base):
    __tablename__ = 'hashtags'

    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String(50), unique=True, nullable=False)

    tweets = relationship(
        "Tweet",
        secondary=tweet_hashtag_table,
        back_populates="hashtags"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "tag": self.tag
        }