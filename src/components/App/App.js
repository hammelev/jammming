import {useEffect, useState} from 'react';

// Components
import AppHeader from '../AppHeader/AppHeader';
import Playlist from '../Playlist/Playlist';
import Searchbar from '../Searchbar/Searchbar';
import SearchResults from '../SearchResults/SearchResults';
import Login from '../Login/Login';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'; // Import the spinner

// Styles
import styles from './app.module.css';
import sharedStyles from '../../styles/sharedStyles.module.css';

// Services
import {searchForTrack, createPlaylist, getUser} from '../../services/spotifyService';


export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultTracks, setSearchResultTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (isAuthenticated) {
      const handleGetUser = async () => {
        handleStartRequest();
        let handleGetUserError = null;
        try {
          const newUser = await getUser();
          setUser(newUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
          handleGetUserError = error;
        } finally {
          handleEndRequest(handleGetUserError);
        };
      }
      handleGetUser();
    }
  }, [isAuthenticated]);

  const handleSearch = async () => {
    handleStartRequest();
    let handleSearchError = null;
    try {
      const tracks = await searchForTrack(searchQuery);
      if (tracks){
        setSearchResultTracks(tracks);
      }
      
    } catch (error) {
      console.error("Error searching for tracks:", error);
      handleSearchError = error;
    } finally {
      handleEndRequest(handleSearchError);
    }
  }

  const handleSavePlayList = async () => {
    handleStartRequest();
    let handleSavePlayListError = null;
    try {
      await createPlaylist(user, playlistName, playlistTracks);
    } catch (error) {
      console.error("Error saving playlist:", error);
      handleSavePlayListError = error;
    } finally {
      handleEndRequest(handleSavePlayListError);
    }
  }

  const handleAddToPlaylist = (track) => {
    setPlaylistTracks( prev => {
      return prev.find(prevTrack => prevTrack.id === track.id) ? prev : [...prev, track];
    });
  }

  const handleRemoveFromPlaylist = (track) => {
    setPlaylistTracks( prev => {
      return prev.filter(prevTrack => prevTrack.id !== track.id);
    });
  }

  const handleStartRequest = () => {
    setIsLoading(true); // Start loading
  }

  const handleEndRequest = (error) => {
    setError(error);
    setIsLoading(false); // Stop loading
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("access_token_expires_at");
    localStorage.removeItem("refresh_token");
    setSearchResultTracks([]);
    setPlaylistTracks([]);
    setPlaylistName("");
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <div className={styles.app}>
      {isLoading && <LoadingSpinner />} {/* Conditionally render the spinner */}
      <AppHeader
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        user={user}
      />
      {error && (
        <p>
          <span className={sharedStyles['error-heading']}>Error:</span> <span>{error.message || 'An unexpected error occured. Please try again.'}</span>
        </p>
      )}
      {
        !isAuthenticated ?
        <Login handleIsAuthenticated={setIsAuthenticated} setIsLoading={setIsLoading}/> :
        <>
          <Searchbar searchQuery={searchQuery} onSetSearchQuery={setSearchQuery} onHandleSearch={handleSearch} />
          <div className={styles["track-container"]}>
            <SearchResults
              tracks={searchResultTracks}
              onAddToPlaylist={handleAddToPlaylist} />
            <Playlist
              tracks={playlistTracks}
              playlistName={playlistName}
              onSetPlaylistName={setPlaylistName}
              onSavePlaylist={handleSavePlayList}
              onRemoveFromPlaylist={handleRemoveFromPlaylist}
            />
          </div>
        </>   
      }
    </div>
  );
}
