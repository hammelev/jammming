// Components
import Tracklist from '../Tracklist/Tracklist';

// Styles
import sharedStyles from '../../styles/sharedStyles.module.css';

export default function SearchResults({tracks, onAddToPlaylist}){
    return (
        <div className={`${sharedStyles['track-lists']}`}>
            <h2>Search Results</h2>
            <Tracklist
                tracks={tracks}
                action={{handler: onAddToPlaylist, symbol: '+'}}
                buttonStyle='primary'
            />
        </div>
    );
}