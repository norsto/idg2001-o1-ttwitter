import styles from './SideFeed.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../Search/SearchBar'; // Import the SearchBar component

export default function SideFeed() {
    const [accounts, setAccounts] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [tweets, setTweets] = useState([]);

    const onSearch = async (searchQuery) => {
        try {
            // Fetch accounts matching the query
            const accountsRes = await fetch(`http://localhost:8000/api/accounts/search?q=${searchQuery}`);
            const accountsData = await accountsRes.json();

            // Fetch hashtags matching the query
            const hashtagsRes = await fetch(`http://localhost:8000/api/hashtags/search?q=${searchQuery}`);
            const hashtagsData = await hashtagsRes.json();

            // Fetch tweets matching the query
            const tweetsRes = await fetch(`http://localhost:8000/api/tweets/search?q=${searchQuery}`);
            const tweetsData = await tweetsRes.json();

            // Update state with the results
            setAccounts(accountsData);
            setHashtags(Array.isArray(hashtagsData) ? hashtagsData : []);
            setTweets(tweetsData);
        } catch (err) {
            console.error('Error during search:', err);
        }
    };

    return (
        <div className={styles.SideFeed}>
            {/* Use the SearchBar component */}
            <SearchBar onSearch={onSearch} />

            <div className={styles.SideFeed__card}>
                <h3 className={styles.SideFeed__card__header}>Search Results</h3>

                {/* Display matching accounts */}
                <div>
                    <h4>Accounts</h4>
                    {accounts.map((account) => (
                        <div key={account.username} className={styles.SideFeed__card__suggestions}>
                            <div>
                                <img 
                                    src="../../../public/npcwojak.png" alt="profilepic"
                                    className={styles.SideFeed__card__suggestions__img} 
                                />
                            </div>
                            <div>
                                <Link 
                                    to={`/${account.username}/profile`}
                                    className={styles.SideFeed__card__suggestions__name}
                                >
                                    {account.username}
                                </Link>
                                <p className={styles.SideFeed__card__suggestions__handle}>@{account.handle}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Display matching hashtags */}
                <div>
                    <h4>Hashtags</h4>
                    {hashtags.map((hashtag) => (
                        <p key={hashtag.id} className={styles.SideFeed__card__suggestions__handle}>
                            #{hashtag.tag}
                        </p>
                    ))}
                </div>

                {/* Display matching tweets */}
                <div>
                    <h4>Tweets</h4>
                    {tweets.map((tweet) => (
                        <div key={tweet.id} className={styles.SideFeed__card__suggestions}>
                            <p>{tweet.content}</p>
                            <p className={styles.SideFeed__card__suggestions__handle}>
                                - @{tweet.account.username}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}