import { useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.trim()) {
            onSearch(value); // Trigger search dynamically
        }
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
        <form className={styles.searchBar} onSubmit={(e) => e.preventDefault()}>
            <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleSearch} // Listen for Enter key
                className={styles.searchBar__input}
            />
        </form>
    );
}

// TODO: idea for search logic still has to be implemented into the feed component