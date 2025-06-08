// Components
import Tracklist from '../Tracklist/Tracklist';

// Styles
import styles from './searchResults.module.css';


// TODO: Pretify Search Results

export default function SearchResults({tracks}){
    return (
        <div className={styles['search-results-container']}>
            <p>Search Results</p>
            <Tracklist tracks={tracks}/>
        </div>
    );
}