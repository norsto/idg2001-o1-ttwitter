from fastapi import FastAPI, HTTPException, Depends, Query, Path  , APIRouter
from typing import Optional, List
from sqlalchemy import func
from sqlalchemy.orm import Session
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend import database
from backend.models import Tweet, Hashtag, Media, Account
from backend.schemas import tweet, hashtag, media, account 
from account_routes import get_current_user

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally: 
        db.close()

@router.get("/")
def index(): 
    return {"name": "Homepage?"} #Maybe all tweets show up here idk

#Get all tweets
@router.get("/api/tweets", response_model=List[tweet.TweetRead])
def get_tweets(q: Optional[str] = Query(None), db: Session = Depends(get_db)):
    if q:
        tweets = db.query(Tweet).filter(Tweet.content.ilike(f"%{q}%")).all()
    else:
        tweets = db.query(Tweet).all()
    if not tweets:
        raise HTTPException(status_code=404, detail="No tweets found")
    return tweets

#Edit tweet
@router.put("/api/{account_id}/tweets/{tweet_id}", response_model=tweet.TweetRead)
def edit_tweets(account_id: int, tweet_id: int, edit_tweet: tweet.TweetUpdate, db: Session = Depends(get_db)):
    tweet = db.query(Tweet).filter(Tweet.id == tweet_id, Tweet.account_id == account_id).first()

    if not tweet:
        raise HTTPException(status_code=404, detail="The tweet you wanted to update was not found")
    
    # Updates text
    if edit_tweet.content is not None:
        tweet.content = edit_tweet.content

    # Updates hashtags
    if edit_tweet.hashtags is not None: 
        tweet.hashtags.clear()

        for tag in edit_tweet.hashtags:
            hashtag = db.query(Hashtag).filter(Hashtag.tag == tag).first()

            if not hashtag:
                hashtag = Hashtag(tag=tag)
                db.add(hashtag)
            tweet.hashtags.append(hashtag)

    # Update media
    if edit_tweet.media is not None:
        for m in tweet.media:
            db.delete(m)
        tweet.media = []

        for url in edit_tweet.media:
            new_media = Media(url=url, tweet=tweet)
            db.add(new_media)

    db.commit()
    db.refresh(tweet)

    return tweet

# Delete tweet
@router.delete("/api/{account_id}/tweets/{tweet_id}", response_model=tweet.TweetRead)
def delete_tweets(account_id: int, tweet_id: int, db: Session = Depends(get_db), current_account: Account = Depends(get_current_user)):

    if current_account.id != account_id:
        raise HTTPException(status_code=403, detail="You don't have access to post, edit, or delete tweets on this account")
    
    tweet = db.query(Tweet).filter(Tweet.id == tweet_id, Tweet.account_id == account_id).first()

    if not tweet:
        raise HTTPException(status_code=404, detail="Tweet not found")
    
    db.delete(tweet)
    db.commit()

    return tweet

#@app.get("/api/tweets", response_model=tweet.TweetRead)
#def get_tweet_containing_text(q: Optional[str] = Query(None), db: Session = Depends(get_db)):
#    if q:
#        tweets = db.query(Tweet).filter(Tweet.content.ilike(f"%{q}")).all()
#    else:
#        tweets = db.query(Tweet).all()
#
#    return tweets

# Search based on hashtags
@router.get("/api/hashtags", response_model=hashtag.hashtagRead)
def get_hashtags(q: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Hashtag)

    if q:
        query = query.filter(func.lower(Hashtag.tag).ilike(f"%{q.lower()}%"))
    
    hashtags = query.all()

    return [h.tag for h in hashtags] 