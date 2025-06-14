import {useState} from 'react';

// Components
import AppHeader from '../AppHeader/AppHeader';
import Playlist from '../Playlist/Playlist';
import Searchbar from '../Searchbar/Searchbar';
import SearchResults from '../SearchResults/SearchResults';
import Login from '../Login/Login';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'; // Import the spinner


// Styles
import styles from './app.module.css';

// Services
import {searchForTrack, createPlaylist} from '../../services/spotifyService';


export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultTracks, setSearchResultTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Implement a useEffect to fetch user data when the user is authenticated to not fetch user data on every call where the user ID is needed


  const handleSearch = async () => {
    setIsLoading(true); // Start loading
    try {
      const tracks = await searchForTrack(searchQuery);
      if (tracks){
        setSearchResultTracks(tracks);
      }
      
    } catch  (error) {
      console.error("Error searching for tracks:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  const handleSavePlayList = async () => {
    setIsLoading(true); // Start loading
    try {
      await createPlaylist(playlistName, playlistTracks);
    } catch (error) {
      console.error("Error saving playlist:", error);
    } finally {
      setIsLoading(false); // Stop loading
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

  const handleLogout = () => {
    setIsLoading(true);
    localStorage.removeItem("access_token");
    localStorage.removeItem("access_token_expires_at");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setIsLoading(false);
  }


  return (
    <div className={styles.app}>
      {isLoading && <LoadingSpinner />} {/* Conditionally render the spinner */}
      <AppHeader isAuthenticated={isAuthenticated} onLogout={handleLogout}/>
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
