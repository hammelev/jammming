import {useEffect, useState} from 'react';

// Components
import Playlist from '../Playlist/Playlist';
import Searchbar from '../Searchbar/Searchbar';
import SearchResults from '../SearchResults/SearchResults';

// Styles
import styles from './app.module.css';

// Services
import {searchForTrack, createPlaylist, handleAuthRedirect} from '../../services/spotifyService';


// TODO: Improve styling of the App e.g. header bar with title of the application and bacground.
// TODO: Call spotifyService to authenticate, search for tracks and create playlist

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultTracks, setSearchResultTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isAuthenticating, setIsAuthenticating] = useState(JSON.parse(localStorage.getItem("isAuthenticating")) || false)

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (window.location.pathname === '/callback' && JSON.parse(localStorage.getItem("isAuthenticating")) !== true) {
        try {
          localStorage.setItem("isAuthenticating", true);
          setIsAuthenticating(true);

          await handleAuthRedirect();

        } catch (error) {
          console.error("Error fetching access token:", error);

        } finally {
          localStorage.setItem("isAuthenticating", false);
          setIsAuthenticating(false);
        }
      }
    }
	handleAuthCallback();
    
  }, [])

  const handleSearch = async () => {
    try {
      const tracks = await searchForTrack(searchQuery);
	  if (tracks){
		setSearchResultTracks(tracks);
	  }
      
    } catch  (error) {
      console.error("Error searching for tracks:", error);
    }
  }

  const handleAddToPlaylist = (track) => {
    setPlaylistTracks( prev => {
      if (prev.find(prevTrack => prevTrack.id === track.id)) {
        return [...prev]
      }
      return [...prev, track];
    });
  }

  const handleRemoveFromPlaylist = (track) => {
    setPlaylistTracks( prev => {
      return prev.filter(prevTrack => prevTrack.id !== track.id);
    });
  }


  const handleSavePlayList = () => {
    alert(`Saving playlist: ${playlistName}`);
  }


  if (window.location.pathname === '/callback') {

    return <p>I Came back from Spotify</p>
  }
  return (
    <div className={styles.app}>
      <header className={styles["app-header"]}>
        <p>
          Jammming
        </p>
      </header>
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

    </div>
  );
}
