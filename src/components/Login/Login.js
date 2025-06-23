import {useState, useEffect} from 'react';

// Styles
import sharedStyles from '../../styles/sharedStyles.module.css';
import buttonStyles from '../../styles/buttons.module.css';

// Services
import {initiateOAuthFlow, handleAuthRedirect} from '../../services/spotifyService';

export default function Login({handleIsAuthenticated, setIsLoading}) {
      const [authenticationError, setAuthenticationError] = useState(false);

    useEffect(() => {
        const handleAuthCallback = async () => {
            if (window.location.pathname === '/jammming/callback') {
                setIsLoading(true);
                try {
                    await handleAuthRedirect();
                    handleIsAuthenticated(true);
                } catch (error) {
                    setAuthenticationError(true);
                    console.error("Error fetching access token:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        }
        handleAuthCallback();
    }, [handleIsAuthenticated, setIsLoading])

    const handleLogin = async () => {
        setAuthenticationError(false);
        try {
            await initiateOAuthFlow();
        } catch (error) {
            setAuthenticationError(true);
            console.error("Error initiating OAuth flow:", error);
        }
        
    }

    return (
        <div>
            <p>To use the application you need a Spotify account.</p>
            <p>Login to Spotify to start creating playlists.</p>
            <button className={buttonStyles.primary} onClick={handleLogin}>Login to Spotify</button>
            {authenticationError &&
                <p>
                    <span className={sharedStyles['error-heading']}>Authentication Error:</span> <span>Please try again!</span>
                </p>
            }
        </div>
    );

}