import styles from './Feed.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Feed() {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/accounts') // kanskje sett env variable for PORT sann at fingrane våra kan leve lenger (API_BASE_URL=blablablabla:1337)...
            .then(res => res.json())
            .then(data => setAccounts(data))
            .catch(err => console.error('Error fetching accounts:', err));
    }, []);

    return (
        <div className={styles.feed}>

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

            <div>
                <div className={styles.feed__tweet}>
                    {accounts.map((account) => (
                        <div className={styles.feed__tweet__user}>
                            <div>
                                <img 
                                    src="../../../public/npcwojak.png" alt="profilepic"
                                    className={styles.feed__tweet__user__img} 
                                />
                            </div>
                            <div className={styles.feed__tweet__user__info}>
                                <div className={styles.feed__tweet__layout}>
                                    <Link 
                                        to={`/username/profile`}
                                        className={styles.feed__tweet__user__info__name}
                                    >
                                    {account.username}
                                    </Link>
                                    <p className={styles.feed__tweet__user__info__handle}>insert handle</p>
                                    <p className={styles.feed__tweet__user__info__timestamp}>- {Math.floor(Math.random() * 10)}h</p>
                                </div>
                                <div>
                                    <p className={styles.feed__tweet__user__post}>The end is near</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}