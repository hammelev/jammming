
// Components
import TrackList from '../Tracklist/Tracklist';

// Styles
import styles from './playlist.module.css';
import sharedStyles from '../../styles/sharedStyles.module.css';
import buttonStyles from '../../styles/buttons.module.css';

export default function Playlist({tracks, playlistName, onSetPlaylistName, onSavePlaylist, onRemoveFromPlaylist}) {

    const handleSavePlaylist = (event) => {
        event.preventDefault();
        onSavePlaylist();
    }

    return (
        <div className={`${sharedStyles['track-lists']}`}>
            <h2>Edit Your Playlist</h2>
            <form className={styles['save-form']} onSubmit={handleSavePlaylist}>
                <div>
                    <label htmlFor="playlistNameInput">Name:</label>
                    <input
                        id="playlistNameInput"
                        type="text"
                        value={playlistName}
                        required
                        onChange={(e) => onSetPlaylistName(e.target.value)}
                    />
                </div>
                <button className={buttonStyles.primary} type='submit'>Save to Spotify</button>
            </form>
            {0 < tracks.length && <h3 className={styles['tracks-heading']}>Tracks:</h3>}
            <TrackList tracks={tracks} action={{handler: onRemoveFromPlaylist, symbol: '-'}}/>
        </div>
    );
}