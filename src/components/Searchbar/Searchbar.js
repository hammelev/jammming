// Styles
import styles from './searchbar.module.css';
import buttonStyles from '../../styles/buttons.module.css';

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
            <input
                type="text"
                placeholder='Input to search'
                onChange={handleSearchChange}
                value={searchQuery}
                required
            />
            <button className={buttonStyles.primary} type="submit">Search</button>
        </form>
    );
}