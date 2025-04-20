from fastapi import FastAPI, HTTPException, Depends, Query, Path  
from typing import Optional, List
from passlib.context import CryptContext
from sqlalchemy import func
from sqlalchemy.orm import Session
from database import SessionLocal
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend import database
from models import Account, Tweet, Hashtag, Media
from schemas.account import AccountRead, AccountCreate, AccountBase
from schemas.tweet import TweetRead, TweetCreate
from schemas.media import MediaBase

app = FastAPI()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally: 
        db.close()

# Create account
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

@app.post("/api/accounts", response_model=AccountRead)
def create_account(account: AccountCreate, db: Session = Depends(get_db)):
    hashed_pw = hash_password(account.password)

    new_account = Account(
        username=account.username,
        email=account.email,
        password=hashed_pw 
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account

# Get all accounts
@app.get("/api/accounts", response_model=List[AccountRead])
def get_all_accounts(db: Session = Depends(get_db)):
    accounts = db.query(Account).all()
    return accounts

# search accounts
@app.get("/api/accounts/search", response_model=List[AccountRead])
def search_accounts(q: str, db: Session = Depends(get_db)):
    return db.query(Account).filter(
        Account.username.ilike(f"%{q}%") | Account.email.ilike(f"%{q}%")
    ).all()

# Get account by username
@app.get("/api/accounts/{account_name}", response_model=AccountRead)
def get_account(account_name: str, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.username == account_name).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return account

# Post tweets
@app.post("/api/{account_id}/tweets", response_model=TweetRead)
def post_tweet(account_id: int, tweet: TweetCreate, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    new_tweet = Tweet(
        content=tweet.content,
        account_id=account_id
    ) 

    if tweet.hashtags:
        hashtag_objects = []

        for tag in tweet.hashtags:
            hashtag = db.query(Hashtag).filter(Hashtag.tag == tag).first()

            if not hashtag:
                hashtag = Hashtag(tag=tag)
                db.add(hashtag)
            
            hashtag_objects.append(hashtag)
        
        new_tweet.hashtags = hashtag_objects
    
    # TODO: Handle media similarly if needed
    if tweet.media:
        media_objects = [Media(url=media_url, media_type="image") for media_url in tweet.media]
        new_tweet.media = media_objects

    db.add(new_tweet)
    db.commit()
    db.refresh(new_tweet)

    return new_tweet