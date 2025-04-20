import styles from './ProfilePage.module.css';
import SideMenu from '../../ui-components/SideMenu/SideMenu';
import PrivateFeed from '../../ui-components/PrivateFeed/PrivateFeed';
import SideFeed from '../../ui-components/SideFeed/SideFeed';

export default function ProfilePage() {
    return (
        <div className={styles.home}>
            <SideMenu className={styles.home__sidemenu} />
            <div className={styles.feed}>
                <div className={styles.feed__container}>
                    <PrivateFeed />
                </div>
            </div>
            <SideFeed className={styles.home__sidemenu} />
        </div>
    );
}