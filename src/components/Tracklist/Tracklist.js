// Components
import Track from '../Track/Track';

// TODO: Add styling for Tracklist

export default function TextTrackList({tracks}){

    const renderTracks = () => {
        return tracks.map((track) => {
            // TODO: Add key property to the Track component when it is known what data is available to make an unique key
            return <Track key={track.id} track={track} />
        });
    }

    return (
        <div>
            {renderTracks()}
        </div>
    );
}