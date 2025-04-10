from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Account
from schemas import AccountCreate

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/accounts")
def create_account(account: AccountCreate, db: Session = Depends(get_db)):
    new_account = Account(
        username=account.username,
        email=account.email,
        password=account.password  # Ideally hash it before storing
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account

""" @app.post("/api/accounts")
def create_account(account_name: str, account_id: int):
    return account[account_name]
"""
@app.get("/api/accounts")
def get_all_accounts():
    return #account

@app.get("/api/accounts/{account_id}")
def get_account(account_name: str):
    return #account[account_name]

@app.post("/api/{account_id}/tweets")
def tweets(account_id: int):
    return tweets[account_id]