import styles from './SideFeed.module.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SideFeed() {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/accounts') // kanskje sett env variable for PORT sann at fingrane våra kan leve lenger (API_BASE_URL=blablablabla:1337)...
            .then(res => res.json())
            .then(data => setAccounts(data))
            .catch(err => console.error('Error fetching accounts:', err));
    }, []);

    return (
        <div className={styles.SideFeed}>

            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    className={styles.SideFeed__search}
                />
            </div>

            <div className={styles.SideFeed__card}>
                <h3 className={styles.SideFeed__card__header}>Who to follow</h3>
                {accounts.map((account) => (
                    <div className={styles.SideFeed__card__suggestions}>
                        <div>
                            <img 
                                src="../../../public/npcwojak.png" alt="profilepic"
                                className={styles.SideFeed__card__suggestions__img} 
                            />
                        </div>
                        <div>
                            <div>
                                <Link 
                                    to={`/username/profile`}
                                    className={styles.SideFeed__card__suggestions__name}
                                >
                                {account.username}
                                </Link>
                                <p className={styles.SideFeed__card__suggestions__handle}>insert handle</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}