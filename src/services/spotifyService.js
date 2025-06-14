let accessToken = localStorage.getItem('access_token') || null;
let accessTokenExpiresAt = localStorage.getItem('access_token_expires_at') ? parseInt(localStorage.getItem('access_token_expires_at'), 10) : null;
let refreshToken = localStorage.getItem('refresh_token') || null;

const getUser = async () => {
	try {
		await checkAndRefreshAuthToken();
		const response = await fetch(`${process.env.REACT_APP_SPOTIFY_API_BASE_URL}/me`, {
			headers: {
				'Authorization': `Bearer ${accessToken}`,
			}
		});

		const data = await response.json();
		return data;
		
	} catch (error) {
		console.error('Error getting user data:', error);
		throw error;
	}
}

const searchForTrack = async (searchQuery) => {
	// Refresh access token if it is expired
	try {
		await checkAndRefreshAuthToken();

		const response = await fetch(`${process.env.REACT_APP_SPOTIFY_API_BASE_URL}/search?q=${searchQuery}&type=track`, {
			headers: {
				'Authorization': `Bearer ${accessToken}`,
			}
		});

		if (!response.ok) {
			// TODO: Handle token expiry (e.g., 401 Unauthorized) and attempt refresh if possible.
			console.error('Error searching for track. Status:', response.status, response.statusText);
			// Consider initiating OAuth flow again if token is invalid and cannot be refreshed.
			// await initiateOAuthFlow();
			return []; // Return empty array or throw error to be handled by caller
		}
		const data = await response.json();
		return data.tracks.items;
	} catch (error) {
		console.error('Network error or JSON parsing error during search:', error);
		return []; // Return empty array or throw error
	}

}

const createPlaylist = async (user, playlistName, tracks) => {
	try {
		await checkAndRefreshAuthToken();

		if (user === null){
			throw new Error('User is null');
		}

		// Create playlist
		const createPlaylistPayload = {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				name: playlistName,
				description: "New playlist description",
				public: false,
			}),
		}

		const createPlayListResponse = await fetch(`${process.env.REACT_APP_SPOTIFY_API_BASE_URL}/users/${user.id}/playlists`, createPlaylistPayload);

		if (!createPlayListResponse.ok) {
			console.error('Error creating playlist:', createPlayListResponse.statusText);
			throw new Error(`Failed to create playlist: ${createPlayListResponse.statusText}`);
		}

		const playlistData = await createPlayListResponse.json();

		// Add tracks
		const addTracksToPlaylistPayload = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				uris: tracks.map(track => track.uri),
			}),
		}

		const addTracksToPlayListResponse = await fetch(`${process.env.REACT_APP_SPOTIFY_API_BASE_URL}/playlists/${playlistData.id}/tracks`, addTracksToPlaylistPayload);

		if (!addTracksToPlayListResponse.ok) {
			console.error('Error adding tracks to playlist:', addTracksToPlaylistPayload.statusText);
			throw new Error(`Error adding tracks to playlist: ${addTracksToPlaylistPayload.statusText}`);
		}

		console.log('Tracks added to playlist successfully.')
		
	} catch (error) {
		console.error('Error creating playlist:', error);
	}
}




const checkAndRefreshAuthToken = async () => {
	if (Date.now() > accessTokenExpiresAt) {
		await refreshAccessToken();
	}
}

const initiateOAuthFlow = async () => {
	try {
		const codeVerifier = base64URLEncode(generateRandom(96));
		const codeChallenge = base64URLEncode(await sha256(codeVerifier));

		// Save to be used when fetching access token
		localStorage.setItem('code_verifier', codeVerifier);

		const params =  {
			response_type: 'code',
			client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
			scope: process.env.REACT_APP_SPOTIFY_SCOPE,
			code_challenge_method: 'S256',
			code_challenge: codeChallenge,
			redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI,
		}

		const authUrl = new URL(process.env.REACT_APP_SPOTIFY_AUTH_URL);
		authUrl.search = new URLSearchParams(params).toString();

		// Redirect to Spotify OAuth page
		window.location.href = authUrl.toString();
	} catch (error) {
		console.error("Error during OAuth initiation:", error);
		// Potentially display an error message to the user or redirect to an error page
		// For now, just logging, as redirecting here might be tricky if window.location is the goal
	}
}

const handleAuthRedirect = async () => {
	const params = new URLSearchParams(window.location.search);
	const code = params.get('code');
	const error = params.get('error');

	if (error) {
		console.error('Spotify authentication error:', error);
		throw error;
	}

	const codeVerifier = localStorage.getItem('code_verifier');

	const payload = {
		method: 'POST',
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
			grant_type: 'authorization_code',
			code,
			redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI,
			code_verifier: codeVerifier,
		}),
	}

	try {
		const response = await fetch(process.env.REACT_APP_SPOTIFY_TOKEN_URL, payload);

		if (!response.ok) {
			console.error('Error fetching access token:', response.statusText);
			return false;
		}

		const body = await response.json();

		accessToken = body.access_token;
		accessTokenExpiresAt = Date.now() + (body.expires_in * 1000); // body.expires_in is typically in seconds
		refreshToken = body.refresh_token;

		localStorage.setItem('access_token', body.access_token);
		localStorage.setItem('access_token_expires_at', accessTokenExpiresAt.toString());
		localStorage.setItem('refresh_token', body.refresh_token); // Only store if present
		window.history.replaceState({}, document.title, "/");

		localStorage.removeItem('code_verifier');
		
		// For now, let's assume it's successful and would return token data
		console.log(`Successfully got access token: ${body.access_token}`);
		return true;
	} catch (error) {
		console.error('Error fetching access token:', error);
		return false;
	}
}

const refreshAccessToken = async () => {

	const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      }),
    }

	try {
		const body = await fetch(process.env.REACT_APP_SPOTIFY_TOKEN_URL, payload);
		const data = await body.json();

		accessToken = data.access_token;
		accessTokenExpiresAt = Date.now() + (data.expires_in * 1000);
		if (body.refresh_token) {
			refreshToken = body.refresh_token;
			localStorage.setItem('refresh_token', body.refresh_token);
		}

		localStorage.setItem('access_token', accessToken);
		localStorage.setItem('access_token_expires_at', accessTokenExpiresAt.toString());

	} catch (error) {
		console.error('Error refreshing access token:', error);
	}

}


/*
 * Base64URL maps + -> -, / -> _ and removes padding = as these characters are not safe in URLs
*/
const base64URLEncode = (input) => {
	return btoa(String.fromCharCode(...new Uint8Array(input)))
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
}

const generateRandom = (length) => {
  	return crypto.getRandomValues(new Uint8Array(length));
}

// The TextEncoder will encode the string with UTF-8.
// For base 64 characters the encoding is the same in ASCII and UTF-8
const sha256 = async (plain) => {
	const encoder = new TextEncoder()
	const data = encoder.encode(plain)
	return window.crypto.subtle.digest('SHA-256', data)
}

export { searchForTrack, createPlaylist, handleAuthRedirect, initiateOAuthFlow, getUser };