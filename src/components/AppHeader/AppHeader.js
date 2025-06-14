// Styles
import styles from './appHeader.module.css';
import buttonStyles from '../../styles/buttons.module.css';

// Assets
import spotifyLogo from '../../assets/Spotify_Full_Logo_RGB_Green.png';


export default function AppHeader({isAuthenticated, onLogout, user}) {
    return (
        <header className={styles['app-header']}>
            <h2 className={styles.title}>Jammming</h2>
            <div className={styles['logo-container']}>
                <p className={styles['logo-text']}>Powered by:</p>
                <img className={styles.logo} src={spotifyLogo} alt='Spotify Logo'/>
            </div>
            {isAuthenticated &&
            <div className={styles['user-area']}>
                <p className={styles['user-text']}>Welcome, {user.display_name}!</p>
                <button className={`${buttonStyles.secondary}`} onClick={onLogout}>Logout</button>
            </div>}
        </header>
    );
}
