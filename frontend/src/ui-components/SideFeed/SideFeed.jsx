import styles from './SideFeed.module.css';

export default function SideFeed() {
    return (
        <div className={styles.SideFeed}>

            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    className={styles.SideFeed__search}
                />
            </div>

            <div className={styles.SideFeed__card}>
                <h3 className={styles.SideFeed__card__header}>Who to follow</h3>
                <p>GET some accounts here...</p>
            </div>
        </div>
    )
}