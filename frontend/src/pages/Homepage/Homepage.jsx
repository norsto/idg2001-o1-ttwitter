import styles from './Homepage.module.css';
import SideMenu from '../../ui-components/SideMenu/SideMenu';
import Feed from '../../ui-components/Feed/Feed';

export default function Homepage() {
    return (
        <div className={styles.home}>
            <SideMenu className={styles.home__sidemenu} />
            <div className={styles.feed}>
                <div className={styles.feed__container}>
                    <Feed />
                </div>
            </div>
        </div>
    );
}