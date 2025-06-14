import {useState} from 'react';

// Components
import Playlist from '../Playlist/Playlist';
import Searchbar from '../Searchbar/Searchbar';
import SearchResults from '../SearchResults/SearchResults';
import Login from '../Login/Login';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'; // Import the spinner


// Styles
import styles from './app.module.css';

// Services
import {searchForTrack, createPlaylist} from '../../services/spotifyService';


// TODO: Separate the header to a separate component with Spotify logo and logout functionality 

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultTracks, setSearchResultTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAddToPlaylist = (track) => {
    setPlaylistTracks( prev => {
      if (prev.find(prevTrack => prevTrack.id === track.id)) {
        return [prev]
      }
      return [...prev, track];
    });
  }

  const handleRemoveFromPlaylist = (track) => {
    setPlaylistTracks( prev => {
      return prev.filter(prevTrack => prevTrack.id !== track.id);
    });
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

  return (
    <div className={styles.app}>
      {isLoading && <LoadingSpinner />} {/* Conditionally render the spinner */}
      <header className={styles["app-header"]}>
        <p>
          Jammming
        </p>
      </header>
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
