import styles from './PrivateFeed.module.css';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function PrivateFeed() {
    const { username } = useParams();
    const [account, setAccount] = useState(null);
    const [sortedTweets, setSortedTweets] = useState([]);

    useEffect(() => {
        if (username) {
            fetch(`http://localhost:8000/api/accounts/${username}`)
                .then(res => res.json())
                .then(data => {
                    setAccount(data);

                    const tweetsWithTime = (data.tweets || []).map(tweet => ({
                        ...tweet,
                        fakeHoursAgo: Math.floor(Math.random() * 10)
                    }));

                    const sorted = tweetsWithTime.sort((a, b) => a.fakeHoursAgo - b.fakeHoursAgo);
                    setSortedTweets(sorted);
                })
                .catch(err => console.error('Error fetching account:', err));
        }
    }, [username]);

    const handleDelete = async (accountId, tweetId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8000/api/${accountId}/tweets/${tweetId}`,  {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
    
            if (!response.ok) {
                throw new Error(`Failed to delete tweet: ${response.statusText}`);
            }
    
            const deletedTweet = await response.json();
    
            // Remove tweet from UI
            setSortedTweets(prev => prev.filter(tweet => tweet.id !== deletedTweet.id));
        } catch (error) {
            console.error('Error deleting tweet:', error);
            alert('Failed to delete tweet. You might not have permission.');
        }
    };    

    if (!account) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.feed}>
            <div className={styles.feed__profile}>
                <div className={styles.feed__profile__top}>
                    <Link className={styles.feed__profile__top__arrow} to="/">&larr;</Link>

                    <div className={styles.feed__profile__top__name}>
                        <h2>{account.username}</h2>
                        <p>{account.tweets ? account.tweets.length : 0} posts</p>
                    </div>
                </div>

                <div className={styles.feed__profile__middle}>
                    <img 
                        src="../../../public/placeholder1.jpg" 
                        alt="coverpic"
                        className={styles.feed__profile__middle__coverimg}
                    />
                    <div className={styles.feed__profile__middle__profileimg}>
                        <img 
                            src="../../../public/pepefrog.jpg" 
                            alt="profilepic" 
                            className={styles.feed__profile__middle__profileimg__img} 
                        />
                    </div>
                </div>

                <div className={styles.feed__profile__bio}>
                    <h2 className={styles.feed__profile__bio__name}>{account.username}</h2>
                    <p className={styles.feed__profile__bio__handle}>@{account.handle}</p>
                    <p className={styles.feed__profile__bio__text}>I like turdals</p>
                    <ul className={styles.feed__profile__bio__info}>
                        <li className={styles.feed__profile__bio__info__item}>Country</li>
                        <li className={styles.feed__profile__bio__info__item}>Birth date</li>
                        <li className={styles.feed__profile__bio__info__item}>{new Date(account.created_at).toLocaleDateString()}</li>
                    </ul>
                </div>
            </div>

            <div>
                <div className={styles.feed__tweet}>
                    <div className={styles.feed__tweet__options}>
                        <button className={styles.feed__tweet__options__button}>Posts</button>
                        <button className={styles.feed__tweet__options__button}>Media</button>
                    </div>

                    {sortedTweets.map((tweet, index) => (
                        <div key={index} className={styles.feed__tweet__user}>
                            <div>
                                <img 
                                    src="../../../public/pepefrog.jpg" alt="profilepic"
                                    className={styles.feed__tweet__user__img} 
                                />
                            </div>
                            <div className={styles.feed__tweet__user__info}>
                                <div className={styles.feed__tweet__layout}>
                                    <Link 
                                        to={`/${account.username}/profile`}
                                        className={styles.feed__tweet__user__info__name}
                                    >
                                        {account.username}
                                    </Link>
                                    <p className={styles.feed__tweet__user__info__handle}>@{account.handle}</p>
                                    <p className={styles.feed__tweet__user__info__timestamp}>- {tweet.fakeHoursAgo}h</p>
                                    <button 
                                    className={styles.feed__tweet__user__info__delete}
                                    onClick={() => handleDelete(account.id, tweet.id)}
                                    title="Delete tweet"
                                    >
                                        &#x1F5D1;
                                    </button>
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