// Styles
import styles from './track.module.css';

export default function Track({track}){
    return (
        <div className={styles['track-container']}>
            {track.album?.images[2]?.url && <img src={track.album?.images[2]?.url} alt={`${track.name} Album Cover`} />}
            <div className={styles['track-info']}>
                <p className={styles['track-title']}>{track.name}</p>
                <p className={styles['track-artist']}>{track.artists.reduce((acc, artist) => acc ? acc + ', ' + artist.name : artist.name, '')}</p>
            </div>
        </div>
    );
}