
// Components
import TrackList from '../Tracklist/Tracklist';

// Styles
import styles from './playlist.module.css';
import sharedStyles from '../../styles/sharedStyles.module.css';

// TODO: Improve styling of Playlist
// TODO: Consider if the Playlist and SearchResults can be implemented in the same component

export default function Playlist({tracks, playlistName, onSetPlaylistName, onSavePlaylist, onRemoveFromPlaylist}) {

    const handleSavePlaylist = () => {
        onSavePlaylist();
    }


    return (
        <div className={`${styles['playlist-container']} ${sharedStyles['track-lists']}`}>
            <h2>Playlist</h2>
            <input type="text" value={playlistName} onChange={(e) => onSetPlaylistName(e.target.value)}/>
            <TrackList tracks={tracks} action={{handler: onRemoveFromPlaylist, symbol: '-'}}/>
            <button onClick={handleSavePlaylist}>Save to Spotify</button>
        </div>
    );
}