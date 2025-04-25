import styles from './Homepage.module.css';
import SideMenu from '../../ui-components/SideMenu/SideMenu';
import Feed from '../../ui-components/Feed/Feed';
import SideFeed from '../../ui-components/SideFeed/SideFeed';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Homepage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login'); // Redirect to login page if no token is found
        }
    }, [navigate]);

    return (
        <div className={styles.home}>
            <SideMenu className={styles.home__sidemenu} />
            <div className={styles.feed}>
                <div className={styles.feed__container}>
                    <Feed />
                </div>
            </div>
            <SideFeed className={styles.home__sidemenu} />
        </div>
    );
}