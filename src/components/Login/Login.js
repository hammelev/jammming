import {useState, useEffect} from 'react';

// Services
import {initiateOAuthFlow, handleAuthRedirect} from '../../services/spotifyService';

export default function Login({handleIsAuthenticated, setIsLoading}) {
      const [authenticationError, setAuthenticationError] = useState(JSON.parse(localStorage.getItem("isAuthenticated")) || false);

    useEffect(() => {
        const handleAuthCallback = async () => {
        if (window.location.pathname === '/callback' && JSON.parse(localStorage.getItem("isAuthenticating")) !== true) {
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
    
    }, [handleIsAuthenticated, setIsLoading]) // Add dependencies

    const handleLogin = async () => {
        // For initiateOAuthFlow, the page redirects, so a spinner might only flash briefly.
        // You might choose to show it or not depending on desired UX.
        // setIsLoading(true); // Potentially show loader before redirect
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