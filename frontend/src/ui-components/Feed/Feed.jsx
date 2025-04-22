import styles from './Feed.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Feed() {
    const [accounts, setAccounts] = useState([]);
    const [allTweets, setAllTweets] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (token) {
            fetch('http://localhost:8000/api/accounts/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(res => res.json())
            .then(data => {
                setUser(data); // Store the logged-in user data
            })
            .catch(err => console.error('Error fetching user data:', err));
        }
    
        // Fetch all accounts for the feed
        fetch('http://localhost:8000/api/accounts')
            .then(res => res.json())
            .then(data => {
                setAccounts(data);
    
                // Add a fake "hours ago" number and sort based on it
                const tweets = data
                    .flatMap(account =>
                        (account.tweets || []).map(tweet => ({
                            ...tweet,
                            accountUsername: account.username,
                            accountHandle: account.handle,
                            fakeHoursAgo: Math.floor(Math.random() * 10)
                        }))
                    )
                    .sort((a, b) => a.fakeHoursAgo - b.fakeHoursAgo); // Most recent first
    
                setAllTweets(tweets);
            })
            .catch(err => console.error('Error fetching accounts:', err));
    }, []);    

    return (
        <div className={styles.feed}>
            {/* Post Tweet Section */}
            <div className={styles.feed__post}>
                <img 
                    src="../../../public/pepefrog.jpg" 
                    alt=""
                    className={styles.feed__post__img}
                />
                <form className={styles.feed__post__form}
                    method="post"
                    encType="multipart/form-data"
                >
                    <textarea 
                        name="tweet" 
                        id="tweet_textfield"
                        className={styles.feed__post__form__input}
                        placeholder='Post propaganda and fake news'
                    ></textarea>
                    <div className={styles.feed__post__form__input__append}>
                        <label>
                            📷
                            <input type="file" name="image" accept="image/*" hidden />
                        </label>
                        <label>
                            🎵
                            <input type="file" name="audio" accept="audio/*" hidden />
                        </label>
                        <label>
                            🎥
                            <input type="file" name="video" accept="video/*" hidden />
                        </label>

                        <button className={`${styles.feed__post__form__input__append__post} button`}>Post</button>
                    </div>
                </form>
            </div>

            {/* Display Tweets */}
            <div>
                <div className={styles.feed__tweet}>
                    {allTweets.map((tweet, index) => (
                        <div key={index} className={styles.feed__tweet__user}>
                            <div>
                                <img 
                                    src="../../../public/npcwojak.png" alt="profilepic"
                                    className={styles.feed__tweet__user__img} 
                                />
                            </div>
                            <div className={styles.feed__tweet__user__info}>
                                <div className={styles.feed__tweet__layout}>
                                    <Link 
                                        to={`/${tweet.accountUsername}/profile`}
                                        className={styles.feed__tweet__user__info__name}
                                    >
                                        {tweet.accountUsername}
                                    </Link>
                                    <p className={styles.feed__tweet__user__info__handle}>@{tweet.accountHandle}</p>
                                    <p className={styles.feed__tweet__user__info__timestamp}>- {tweet.fakeHoursAgo}h</p>
                                </div>
                                <div>
                                    <p className={styles.feed__tweet__user__post}>{tweet.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

{/* SORT BY CREATED_AT */}
{/* 
import styles from './Feed.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Feed() {
    const [accounts, setAccounts] = useState([]);
    const [allTweets, setAllTweets] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/accounts')
            .then(res => res.json())
            .then(data => {
                setAccounts(data);

                // Flatten and sort tweets
                const tweets = data
                    .flatMap(account => 
                        account.tweets?.map(tweet => ({
                            ...tweet,
                            accountUsername: account.username,
                            accountHandle: account.handle
                        })) || []
                    )
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // most recent first

                setAllTweets(tweets);
            })
            .catch(err => console.error('Error fetching accounts:', err));
    }, []);

    return (
        <div className={styles.feed}>

            <div className={styles.feed__post}>
                
                </div>

                <div>
                    <div className={styles.feed__tweet}>
                        {allTweets.map((tweet, index) => (
                            <div key={index} className={styles.feed__tweet__user}>
                                <div>
                                    <img 
                                        src="../../../public/npcwojak.png" alt="profilepic"
                                        className={styles.feed__tweet__user__img} 
                                    />
                                </div>
                                <div className={styles.feed__tweet__user__info}>
                                    <div className={styles.feed__tweet__layout}>
                                        <Link 
                                            to={`/${tweet.accountUsername}/profile`}
                                            className={styles.feed__tweet__user__info__name}
                                        >
                                            {tweet.accountUsername}
                                        </Link>
                                        <p className={styles.feed__tweet__user__info__handle}>@{tweet.accountHandle}</p>
                                        <p className={styles.feed__tweet__user__info__timestamp}>- {Math.floor(Math.random() * 10)}h</p>
                                    </div>
                                    <div>
                                        <p className={styles.feed__tweet__user__post}>{tweet.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
    
            </div>
        );
    }
       
*/}