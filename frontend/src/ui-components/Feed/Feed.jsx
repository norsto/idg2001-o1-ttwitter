import styles from './Feed.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Feed() {
    const [accounts, setAccounts] = useState([]);
    const [allTweets, setAllTweets] = useState([]);
    const [tweetPost, setTweetPost] = useState('');
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
                //setAccounts(data);
    
                // Sort by created_at(timestamp)
                const tweets = data
                    .flatMap(account =>
                        (account.tweets || []).map(tweet =>{
                            return {
                            ...tweet,
                            accountUsername: account.username,
                            accountHandle: account.handle,
                            created_at: tweet.created_at 
                                }
                        })
                    )
                    .sort((a, b) => b.created_at - a.created_at); // Most recent first

                setAllTweets(tweets);

            })
            .catch(err => console.error('Error fetching accounts:', err));      
    }, []);    

    function handleTweetSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");
    
        if (!token || !tweetPost.trim()) return;
    
        // Extract hashtags from the tweet content
        const hashtagList = tweetPost
            .match(/#[a-zA-Z0-9_]+/g) // Match words starting with #
            ?.map(tag => tag.slice(1)) // Remove the '#' symbol
            || [];
    
        fetch('http://localhost:8000/api/tweets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                content: tweetPost,
                hashtags: hashtagList,
                media: []  
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`Failed to post tweet: ${res.statusText}`);
            }
            return res.json();
        })
        .then(newTweet => {
            setAllTweets(prev => [{
                ...newTweet,
                accountUsername: user.username,
                accountHandle: user.handle,
                created_at: newTweet.created_at
            }, ...prev]);
            setTweetPost('');
        })
        .catch(err => console.error('Error posting tweet:', err));
    }
    
    function formatRelativeTime(timestamp) {

        if (!timestamp) {
            console.error('Invalid timestamp:', timestamp);   
            return 'just now'
        }
        
        const now = Date.now();
        const diff = (now - timestamp) / 1000; // seconds

        if (diff < 60) return `${Math.floor(diff)}s`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        return `${Math.floor(diff / 86400)}d`;
    }    

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
                    onSubmit={handleTweetSubmit}
                >
                    <textarea 
                        name="tweet" 
                        id="tweet_textfield"
                        className={styles.feed__post__form__input}
                        placeholder='Post propaganda and fake news'
                        value={tweetPost}
                        onChange={(e) => setTweetPost(e.target.value)}
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

                        <button type="submit" className={`${styles.feed__post__form__input__append__post} button`}>Post</button>
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
                                    <p className={styles.feed__tweet__user__info__timestamp}>- {formatRelativeTime(tweet.created_at)}</p>
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