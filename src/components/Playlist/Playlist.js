
// Components
import TrackList from '../Tracklist/Tracklist';

// TODO: Add styling for Playlist
// TODO: Consider if the Playlist and SearchResults can be implemented in the same component
// TODO: Implement playlist naming i.e. an input field

export default function Playlist({tracks}) {

    return (
        <div>
            <p>Playlist</p>
            <TrackList tracks={tracks}/>
        </div>
    );
}