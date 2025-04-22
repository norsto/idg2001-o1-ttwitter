import styles from './LoginPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch('http://localhost:8000/api/accounts/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username: formData.username,
                    password: formData.password
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Login failed');
            }

            const data = await res.json();
            localStorage.setItem('token', data.access_token);

            navigate('/'); // Redirect to home or feed
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.login}>
            <div>
                <h1 className={styles.login__logo}>Z</h1>
            </div>
            <div className={styles.login__form}>
                <div className={styles.login__form__login}>
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.login__form__login__email}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.login__form__login__password}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.login__form__login__submit}>
                            <button type="submit">Login</button>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>
                        <div className={styles.login__form__login__forgot}>
                            <button type="button">Forgot password</button>
                        </div>
                    </form>
                </div>
                <div className={styles.login__form__register}>
                    <p>Don't have an account?</p>
                    <Link className={styles.login__form__register__button} to="/register">
                        Register Account
                    </Link>
                </div>
            </div>
        </div>
    );
}