import styles from './RegisterPage.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        username: '',
        handle: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        const { confirmPassword, ...cleanData } = formData;

        try {
            const res = await fetch('http://localhost:8000/api/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanData),
            });

            if(!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Registration failed');
            }
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.register}>
            <h1>Create an Account</h1>
            <form className={styles.register__form} onSubmit={handleSubmit}>
                <div className={styles.register__form__name}>
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

                <div className={styles.register__form__name}>
                    <label htmlFor="handle">Handle</label>
                    <input
                        type="text"
                        id="handle"
                        name="handle"
                        value={formData.handle}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.register__form__email}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.register__form__password}>
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

                <div className={styles.register__form__confirm}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.register__form__button}>
                    <button type="submit">Register</button>
                    {error && <p>{error}</p>}
                </div>
            </form>
        </div>
    );
}