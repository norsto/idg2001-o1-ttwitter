from fastapi import FastAPI, HTTPException, Depends, Query, Path, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional, List
from passlib.context import CryptContext
from sqlalchemy import func
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.auth import auth_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend import database
from backend.models import Account, Tweet, Hashtag, Media
from backend.schemas.account import AccountRead, AccountCreate, AccountBase
from backend.schemas.tweet import TweetRead, TweetCreate, TweetUpdate, TweetBase
from backend.schemas.media import MediaBase, MediaCreate, MediaRead

router = APIRouter()

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

@router.post("/api/accounts", response_model=AccountRead)
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

# Login
@router.post("/api/accounts/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Get all accounts
@router.get("/api/accounts", response_model=List[AccountRead])
def get_all_accounts(db: Session = Depends(get_db)):
    accounts = db.query(Account).all()
    return accounts

# search accounts
@router.get("/api/accounts/search", response_model=List[AccountRead])
def search_accounts(q: str, db: Session = Depends(get_db)):
    return db.query(Account).filter(
        Account.username.ilike(f"%{q}%") | Account.email.ilike(f"%{q}%")
    ).all()

# Get account by username
@router.get("/api/accounts/{account_name}", response_model=AccountRead)
def get_account(account_name: str, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.username == account_name).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return account

# TODO: test and add authentication to to protected routes
# Post tweets
@router.post("/api/{account_id}/tweets", response_model=TweetRead)
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