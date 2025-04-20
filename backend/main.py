import uvicorn
from routes import account_routes, tweet_routes
from fastapi import FastAPI

app = FastAPI()
app.include_router(account_routes.app)
app.include_router(tweet_routes.app)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)