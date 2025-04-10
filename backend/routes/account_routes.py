from fastapi import FastAPI, Path 

app = FastAPI()

@app.post("/api/accounts")
def create_account(account_name: str, account_id: int):
    return account[account_name]

@app.get("/api/accounts")
def get_all_accounts():
    return account

@app.get("/api/accounts/{account_id}")
def get_account(account_name: str):
    return account[account_name]

@app.post("/api/{account_id}/tweets")
def tweets(account_id: int):
    return tweets[account_id]