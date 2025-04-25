import { useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (query.trim()) {
                onSearch(query); // Trigger search on Enter key
            }
        }
    };

    return (
        <form className={styles.search} onSubmit={(e) => e.preventDefault()}>
            <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleSearch} // Listen for Enter key
                className={styles.search__input}
            />
        </form>
    );
}