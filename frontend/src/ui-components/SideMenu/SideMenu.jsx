import styles from './SideMenu.module.css';
import { Link } from 'react-router-dom';

export default function SideMenu() {
    return(
        <div className={styles.menu__side}>
            <div>
                <div>
                    <h1 className={styles.menu__side__logo}>X</h1>
                    <ul className={styles.menu__side__list}>
                        <li className={styles.menu__side__list__item}>Home</li>
                        <li className={styles.menu__side__list__item}>Profile</li>
                        <li className={styles.menu__side__list__item}>More</li>
                    </ul>
                </div>

                <div>
                    <button className={styles.menu__side__button}>
                        Post
                    </button>
                </div>
            </div>

            <div className={styles.menu__side__user}>
                <div>
                    <img 
                    src="../../../public/pepefrog.jpg" alt="profilepic"
                    className={styles.menu__side__user__img} 
                    />
                </div>
                <div>
                    <Link to={`/username/profile`}
                    className={styles.menu__side__user__name}
                    >
                        Username
                    </Link>
                    <p className={styles.menu__side__user__handle}>@username123</p>
                </div>
                <div className={styles.menu__side__user__button}>
                    <button>...</button>
                </div>
            </div>

        </div>
    )
}