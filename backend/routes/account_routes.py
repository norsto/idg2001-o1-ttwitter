from fastapi import FastAPI, HTTPException, Depends, Form, APIRouter
from typing import List
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.auth import auth_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer  # Import OAuth2PasswordBearer
import os
from backend import database
from backend.models import Account, Tweet, Hashtag, Media
from backend.schemas.account import AccountRead, AccountCreate, AccountBase
from backend.schemas.tweet import TweetRead, TweetCreate, TweetUpdate, TweetBase
from backend.schemas.media import MediaBase, MediaCreate, MediaRead

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if SECRET_KEY is None:
    raise ValueError("SECRET_KEY environment variable is not set.")
ALGORITHM = "HS256"

router = APIRouter()

# Password hashing function
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verifying password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Database session dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally: 
        db.close()

# Authenticate user (login by username)
def auth_user(db: Session, username: str, password: str):
    user = db.query(Account).filter(Account.username == username).first()
    if not user or not verify_password(password, user.password):
        return None
    return user

# JWT auth dependency
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/accounts/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        # Decode JWT token to get user details
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Fetch user from the database
    user = db.query(Account).filter(Account.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# Routes
@router.post("/api/accounts", response_model=AccountRead)
def create_account(account: AccountCreate, db: Session = Depends(get_db)):
    hashed_pw = hash_password(account.password)

    new_account = Account(
        username=account.username,
        email=account.email,
        handle=account.handle,
        password=hashed_pw 
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account

# Login with username
@router.post("/api/accounts/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = auth_user(db, username, password)
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

# Search accounts
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

# Post tweet (requires authentication)
@router.post("/api/tweets", response_model=TweetRead)
def post_tweet(
    tweet: TweetCreate, 
    db: Session = Depends(get_db), 
    current_user: Account = Depends(get_current_user)
):
    account = db.query(Account).filter(Account.id == current_user.id).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # Create the tweet
    new_tweet = Tweet(
        content=tweet.content,
        account_id=account.id
    )

    # Handle hashtags
    if tweet.hashtags:
        hashtag_objects = []
        for tag in tweet.hashtags:
            hashtag = db.query(Hashtag).filter(Hashtag.tag == tag).first()
            if not hashtag:
                hashtag = Hashtag(tag=tag)
                db.add(hashtag)
            hashtag_objects.append(hashtag)
        new_tweet.hashtags = hashtag_objects
    
    # Handle media (optional)
    if tweet.media:
        media_objects = [Media(url=media_url, media_type="image") for media_url in tweet.media]
        new_tweet.media = media_objects

    # Save the new tweet to the database
    db.add(new_tweet)
    db.commit()
    db.refresh(new_tweet)

    return new_tweet