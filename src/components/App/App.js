import {useEffect, useState} from 'react';

// Components
import Playlist from '../Playlist/Playlist';
import Searchbar from '../Searchbar/Searchbar';
import SearchResults from '../SearchResults/SearchResults';
import Login from '../Login/Login';

// Styles
import styles from './app.module.css';

// Services
import {searchForTrack, createPlaylist} from '../../services/spotifyService';


// TODO: Improve styling of the App e.g. header bar with title of the application and bacground.
// TODO: Call spotifyService to authenticate, search for tracks and create playlist

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultTracks, setSearchResultTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));

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

  return (
    <div className={styles.app}>
      <header className={styles["app-header"]}>
        <p>
          Jammming
        </p>
      </header>
      {
        isAuthenticated ?
        <Searchbar searchQuery={searchQuery} onSetSearchQuery={setSearchQuery} onHandleSearch={handleSearch} /> :
        <Login handleIsAuthenticated={setIsAuthenticated}/>
      }
      
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
