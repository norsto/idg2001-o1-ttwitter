import styles from './LoginPage.module.css';
import { Link } from 'react-router-dom';

export default function LoginPage() {
    return (
        <div className={styles.login}>
            <div>
                <h1 className={styles.login__logo}>Z</h1>
            </div>
            <div className={styles.login__form}>
                <div className={styles.login__form__login}>
                    <h1>Login</h1>
                    <form>
                        <div className={styles.login__form__login__email}>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" required />
                        </div>
                        <div className={styles.login__form__login__password}>
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" required />
                        </div>
                        <div className={styles.login__form__login__submit}>
                            <button type="submit">Login</button>
                        </div>
                        <div className={styles.login__form__login__forgot}>
                            <button>Forgot password</button>
                        </div>
                    </form>
                </div>
                <div className={styles.login__form__register}>
                    <p>
                        Don't have an account?
                    </p>
                    <Link className={styles.login__form__register__button} to="/register">
                        Register Account
                    </Link>
                </div>
            </div>
        </div>
    )
}