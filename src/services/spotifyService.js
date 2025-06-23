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

		if (!response.ok) {
			throw await handleRequestFailed(response, `Error getting user data`);
		}

		const data = await response.json();
		return data;
		
	} catch (error) {
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
			throw await handleRequestFailed(response, `Error searching for track`);
		}
		
		const data = await response.json();
		return data.tracks.items;
	} catch (error) {
		console.error('Network error or JSON parsing error during search:', error);
		throw error;
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
			throw await handleRequestFailed(createPlayListResponse, `Error creating playlist`);
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
			throw await handleRequestFailed(addTracksToPlayListResponse, `Error adding tracks to playlist`);
		}

		console.log('Tracks added to playlist successfully.')
	} catch (error) {
		throw error;
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
		throw error;
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
			throw await handleRequestFailed(response, `Error fetching access token`);
		}

		const body = await response.json();

		accessToken = body.access_token;
		accessTokenExpiresAt = Date.now() + (body.expires_in * 1000); // body.expires_in is typically in seconds
		refreshToken = body.refresh_token;

		localStorage.setItem('access_token', body.access_token);
		localStorage.setItem('access_token_expires_at', accessTokenExpiresAt.toString());
		localStorage.setItem('refresh_token', body.refresh_token); // Only store if present
		window.history.replaceState({}, document.title, "/jammming");

		localStorage.removeItem('code_verifier');
		
		return true;
	} catch (error) {
		throw error;
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
		const response = await fetch(process.env.REACT_APP_SPOTIFY_TOKEN_URL, payload);

		if (!response.ok) {
			throw await handleRequestFailed(response, `Error refreshing access token`);
		}

		const data = await response.json();

		accessToken = data.access_token;
		accessTokenExpiresAt = Date.now() + (data.expires_in * 1000);
		if (data.refresh_token) {
			refreshToken = data.refresh_token;
			localStorage.setItem('refresh_token', data.refresh_token);
		}

		localStorage.setItem('access_token', accessToken);
		localStorage.setItem('access_token_expires_at', accessTokenExpiresAt.toString());

	} catch (error) {
		console.error('Error refreshing access token:', error.message);
		throw error;
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

const handleRequestFailed = async (response, defaultErrorMessage) => {
	let errorInfoMessage = defaultErrorMessage; // Default message for the Error object
	let consoleLogDetail = 'Could not parse error response body.';

	try {
		const errorData = await response.json();
		if (errorData){
			// Spotify error responses can vary, try to extract the most relevant message
			if (errorData.error && typeof errorData.error === 'object' && errorData.error.message) {
                errorInfoMessage = errorData.error.message; // e.g. { error: { status: 401, message: "Invalid access token" } }
            } else if (errorData.error_description) {
                errorInfoMessage = errorData.error_description; // e.g. { error: "invalid_grant", error_description: "Invalid refresh token" }
            } else if (typeof errorData.error === 'string') {
                errorInfoMessage = errorData.error; // e.g. { error: "some_error_code" }
            }
			consoleLogDetail = JSON.stringify(errorData);
		}
	} catch (error) {
		// Failed to parse JSON body, consoleLogDetail remains 'Could not parse error response body.'
	}

	console.error(`${defaultErrorMessage}. Status: ${response.status} ${response.statusText}. Details: ${consoleLogDetail}`);
	const err = new Error(errorInfoMessage);
	err.name = 'SpotifyAPIError';
	err.status = response.status;
	err.statusText = response.statusText;
	return err;
}

export { searchForTrack, createPlaylist, handleAuthRedirect, initiateOAuthFlow, getUser };