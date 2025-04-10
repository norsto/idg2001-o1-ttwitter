from sqlalchemy import Table, Column, Integer, ForeignKey
from backend.database import Base

tweet_hashtag_table = Table(
    'tweet_hashtag',
    Base.metadata,
    Column('tweet_id', Integer, ForeignKey('tweets.id')),
    Column('hashtag_id', Integer, ForeignKey('hashtags.id'))
)
