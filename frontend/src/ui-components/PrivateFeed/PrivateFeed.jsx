import styles from './PrivateFeed.module.css';
import { Link } from 'react-router-dom';

export default function PrivateFeed() {
    return (
        <div className={styles.feed}>

            <div className={styles.feed__profile}>

                <div className={styles.feed__profile__top}>
                    <Link className={styles.feed__profile__top__arrow} to="/">&larr;</Link>

                    <div className={styles.feed__profile__top__name}>
                        <h2>Username</h2>
                        <p>{Math.floor(Math.random() * 1000)} posts</p>
                    </div>
                </div>

                <img 
                    src="../../../public/placeholder1.jpg" 
                    alt="profilepic"
                    className={styles.feed__profile__coverimg}
                />

            </div>

            <div>
                <div className={styles.feed__tweet}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                        <div className={styles.feed__tweet__user}>
                            <div>
                                <img 
                                    src="../../../public/pepefrog.jpg" alt="profilepic"
                                    className={styles.feed__tweet__user__img} 
                                />
                            </div>
                            <div className={styles.feed__tweet__user__info}>
                                <div className={styles.feed__tweet__layout}>
                                    <Link 
                                        to={`/username/profile`}
                                        className={styles.feed__tweet__user__info__name}
                                    >
                                    Username
                                    </Link>
                                    <p className={styles.feed__tweet__user__info__handle}>@username123</p>
                                    <p className={styles.feed__tweet__user__info__timestamp}>- {Math.floor(Math.random() * 10)}h</p>
                                </div>
                                <div>
                                    <p>The end is near</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}