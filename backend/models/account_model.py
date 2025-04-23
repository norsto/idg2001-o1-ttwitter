from sqlalchemy import Column, Integer, String, DateTime, event
from sqlalchemy.orm import relationship
from datetime import datetime
from zoneinfo import ZoneInfo
from backend.database import Base

class Account(Base):
    __tablename__ = 'accounts'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    handle = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(ZoneInfo('UTC')))

    tweets = relationship("Tweet", back_populates="account", cascade="all, delete-orphan")

    def to_dict(self):
        try:
            timestamp = int(self.created_at.timestamp() * 1000)
        except (AttributeError, TypeError):
            # Fallback if timestamp is invalid
            timestamp = int(datetime.now(ZoneInfo('UTC')).timestamp() * 1000)
    
        return {
            "id": self.id,
            "username": self.username,
            "handle": self.handle,
            "email": self.email,
            "created_at": int(self.created_at.timestamp() * 1000)
        }
    