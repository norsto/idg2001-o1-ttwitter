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
                    <h2 className={styles.feed__profile__bio__name}>Username</h2>
                    <p className={styles.feed__profile__bio__handle}>@username123</p>
                    <p className={styles.feed__profile__bio__text}>I like turdals</p>
                    <ul className={styles.feed__profile__bio__info}>
                        <li className={styles.feed__profile__bio__info__item}>Country</li>
                        <li className={styles.feed__profile__bio__info__item}>Birth date</li>
                        <li className={styles.feed__profile__bio__info__item}>Account age</li>
                    </ul>
                </div>

            </div>

            <div>
                <div className={styles.feed__tweet}>
                    <div className={styles.feed__tweet__options}>
                        <button className={styles.feed__tweet__options__button}>Posts</button>
                        <button className={styles.feed__tweet__options__button}>Media</button>
                    </div>
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