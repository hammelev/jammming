
// Components
import TrackList from '../Tracklist/Tracklist';

// Styles
import styles from './playlist.module.css';


// TODO: Improve styling of Playlist
// TODO: Consider if the Playlist and SearchResults can be implemented in the same component

export default function Playlist({tracks, playlistName, onSetPlaylistName, onSavePlaylist}) {

    const handleSavePlaylist = () => {
        onSavePlaylist();
    }


    return (
        <div className={styles['playlist-container']}>
            <p>Playlist</p>
            <input type="text" value={playlistName} onChange={(e) => onSetPlaylistName(e.target.value)}/>
            <TrackList tracks={tracks}/>
            <button onClick={handleSavePlaylist}>Save to Spotify</button>
        </div>
    );
}