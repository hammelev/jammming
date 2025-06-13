// Components
import Tracklist from '../Tracklist/Tracklist';

// Styles
import styles from './searchResults.module.css';
import sharedStyles from '../../styles/sharedStyles.module.css';




// TODO: Pretify Search Results

export default function SearchResults({tracks, onAddToPlaylist}){
    return (
        <div className={`${sharedStyles['track-lists']} ${styles['search-results-container']}`}>
            <h2>Search Results</h2>
            <Tracklist
                tracks={tracks}
                action={{handler: onAddToPlaylist, symbol: '+'}}
            />
        </div>
    );
}