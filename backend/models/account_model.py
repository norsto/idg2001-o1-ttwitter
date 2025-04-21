from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

tweets = relationship("Tweet", back_populates="account")

class Account(Base):
    __tablename__ = 'accounts'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    tweets = relationship("Tweet", back_populates="account", cascade="all, delete")