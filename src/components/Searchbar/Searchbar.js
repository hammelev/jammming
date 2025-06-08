// Styles
import styles from './searchbar.module.css';

// TODO: Pretify search bar

export default function Searchbar({searchQuery, onSetSearchQuery, onHandleSearch}) {

    const handleSearchChange = (event) => {
        onSetSearchQuery(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onHandleSearch();
    }
    
    return (
        <form className={styles["search-bar"]} onSubmit={handleSubmit}>
            <input type="text" onChange={handleSearchChange} value={searchQuery} />
            <button type="submit">Search</button>
        </form>
    );
}