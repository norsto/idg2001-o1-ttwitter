from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from backend import database
from backend.models import Account

# CONFIG 
SECRET_KEY = "replace-this-with-env-variable"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# SETUP 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# PASSWORD UTILS 
def verify_password(plain_pwd, hashed_pwd):
    return pwd_context.verify(plain_pwd, hashed_pwd)

def hash_password(password):
    return pwd_context.hash(password)

# TOKEN CREATION
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# DATABASE UTILS
def get_account_by_email(db: Session, email: str):
    return db.query(Account).filter(Account.email == email).first()

# AUTHENTICATION
def auth_user(db: Session, email: str, password: str):
    user = get_account_by_email(db, email)
    if not user or not verify_password(password, user.password):
        return None
    return user

# CURRENT USER
def get_current_user(
    db: Session = Depends(database.SessionLocal),
    token: str = Depends(oauth2_scheme)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_account_by_email(db, email)
    if user is None:
        raise credentials_exception
    return user