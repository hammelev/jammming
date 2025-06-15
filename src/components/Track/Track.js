// Styles
import styles from './track.module.css';

// TODO: Add more information about tracks

export default function Track({track}){
    return (
        <div className={styles['track-container']}>
            <img src={track.album.images[2].url} alt={track.name} />
            <div className={styles['track-info']}>
                <p className={styles['track-title']}>{track.name}</p>
                <p className={styles['track-artist']}>{track.artists.reduce((acc, artist) => acc ? acc + ', ' + artist.name : artist.name, '')}</p>
            </div>
        </div>
    );
}