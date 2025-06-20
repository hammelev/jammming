// Components
import Track from '../Track/Track';

// Styles
import styles from './tracklist.module.css';

export default function TrackList({tracks, action, buttonStyle}){

    const renderTracks = () => {
        return tracks.map((track) => {
            return (
                <div key={track.id}>
                    <div className={styles['track-container']}>
                        <Track track={track} />
                        <button
                            className={`${styles['action-button-'+buttonStyle]}`}
                            onClick={() => action.handler(track)}>
                                {action?.symbol ?? '?'}
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