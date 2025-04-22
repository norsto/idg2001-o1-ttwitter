from fastapi import FastAPI, HTTPException, Depends, Form, APIRouter
from typing import List
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.auth import auth_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user
from datetime import timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv
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

# Hashing Passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Database session dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally: 
        db.close()

# Authenticate User (login by email)
def auth_user(db: Session, email: str, password: str):
    user = db.query(Account).filter(Account.email == email).first()
    if not user or not verify_password(password, user.password):
        return None
    return user

# JWT Authentication Dependency
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/accounts/login")

# Function to get the current logged-in user from the token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        # Decode the JWT token to get user details
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Fetch the user from the database
    user = db.query(Account).filter(Account.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Routes

# Create account
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

# Login with email
@router.post("/api/accounts/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = auth_user(db, email, password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(
        data={"sub": user.email},
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

# Get current logged-in user's data
@router.get("/api/accounts/me", response_model=AccountRead)
def get_current_account(current_user: Account = Depends(get_current_user), db: Session = Depends(get_db)):
    # Fetch user data using the current logged-in user (who is decoded from the token)
    user = db.query(Account).filter(Account.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

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