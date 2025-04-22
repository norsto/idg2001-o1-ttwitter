# seed_data.py
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..', 'backend')))

import random
from faker import Faker
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend.models import Account, Tweet, Hashtag, Media

# --- Setup
fake = Faker()
MEDIA_DIR = "app/media/"
SAMPLE_IMAGES = [
    "sample1.jpg",  # Make sure these dummy files exist in app/media/
    "sample2.jpg",
    "sample3.png"
]
SAMPLE_HASHTAGS = ["funny", "cool", "fastapi", "react", "azure", "weekend", "memes"]

# --- Create tables
Base.metadata.create_all(bind=engine)

def create_accounts(session: Session, count=5):
    accounts = []
    for _ in range(count):
        account = Account(
            username=fake.user_name(),
            email=fake.email(),
            handle=fake.user_name(),
            password=fake.password(length=12)
        )
        session.add(account)
        accounts.append(account)
    session.commit()
    return accounts

def create_hashtags(session: Session):
    tag_objects = []
    for tag in SAMPLE_HASHTAGS:
        hashtag = Hashtag(tag=tag)
        session.add(hashtag)
        tag_objects.append(hashtag)
    session.commit()
    return tag_objects

def create_tweets_with_media(session: Session, accounts, hashtags, count_per_user=3):
    os.makedirs(MEDIA_DIR, exist_ok=True)

    for account in accounts:
        for _ in range(count_per_user):
            tweet = Tweet(
                content=fake.sentence(nb_words=10),
                account_id=account.id
            )
            session.add(tweet)
            session.commit()

            # Random hashtags
            tweet.hashtags = random.sample(hashtags, k=random.randint(0, 3))

            # Attach a fake media file reference
            sample_file = random.choice(SAMPLE_IMAGES)
            media = Media(
                url=f"/media/{sample_file}",
                media_type="image",
                tweet_id=tweet.id
            )
            session.add(media)

            session.commit()

def main():
    db: Session = SessionLocal()
    try:
        print("Seeding dummy data...")
        accounts = create_accounts(db)
        hashtags = create_hashtags(db)
        create_tweets_with_media(db, accounts, hashtags)
        print("✅ Seed completed successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    main()
