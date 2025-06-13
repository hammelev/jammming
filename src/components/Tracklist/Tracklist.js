// Components
import Track from '../Track/Track';

import styles from './tracklist.module.css';

// TODO: Add styling for Tracklist

export default function TrackList({tracks, action}){

    const renderTracks = () => {
        return tracks.map((track) => {
            return (
                <div key={track.id}>
                    <div className={styles['track-container']}>
                        <Track track={track} />
                        <button
                            className={styles['action-button']}
                            onClick={() => action.handler(track)}>{action?.symbol ? action.symbol : '?'}
                        </button>
                    </div>
                    <hr/>
                </div>
            )
        });
    }

    return (
        <div>
            {renderTracks()}
        </div>
    );
}