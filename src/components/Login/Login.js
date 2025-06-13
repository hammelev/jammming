import {useState, useEffect} from 'react';

// Services
import {initiateOAuthFlow, handleAuthRedirect} from '../../services/spotifyService';

export default function Login({handleIsAuthenticated}) {
      const [authenticationError, setAuthenticationError] = useState(JSON.parse(localStorage.getItem("isAuthenticated")) || false);

    useEffect(() => {
        const handleAuthCallback = async () => {
        if (window.location.pathname === '/callback' && JSON.parse(localStorage.getItem("isAuthenticating")) !== true) {
            try {

            await handleAuthRedirect();

            handleIsAuthenticated(true);

            } catch (error) {
                setAuthenticationError(true);
                console.error("Error fetching access token:", error);
            }
        }
        }
        handleAuthCallback();
    
    }, [])

    const handleLogin = async () => {
        setAuthenticationError(false);
        await initiateOAuthFlow();
    }

    return (
        <div>
            <p>To start using the application you need to login</p>
            <button onClick={handleLogin}>Login</button>
            {authenticationError && <p>Authentication Error - Please try to again!</p>}
        </div>
    );

}