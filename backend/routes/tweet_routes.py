from fastapi import FastAPI, Path 
from typing import Optional

app = FastAPI()

@app.get("/")
def index(): 
    return {"name": "Homepage?"} #Maybe all tweets show up here idk

@app.get("/api/tweets")
def tweets():
    return tweets

@app.put("/api/{account_id}/tweets/{tweet_id}")
def edit_tweets(account_id: int, tweet_id: int):
    return tweets[account_id, tweet_id]

@app.get("/api/tweets")
def get_tweets():
    return tweets

@app.get("/api/tweets?")
def get_tweet_content():
    return tweets

@app.get("/api/:hashtags?")
def get_hashtags():
    return #hashtags 



""" @app.get("/get-student/{student_id}")
def get_student(student_id: int = Path(description="The ID of the student you want to view", gt=0)):
    return students[student_id] """
