import {useState} from 'react';

// Components
import Playlist from '../Playlist/Playlist';
import Searchbar from '../Searchbar/Searchbar';
import SearchResults from '../SearchResults/SearchResults';

// Styles
import styles from './app.module.css';

// TODO: Improve styling of the App e.g. header bar with title of the application and bacground.
// TODO: Call spotifyService to authenticate, search for tracks and create playlist

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultTracks, setSearchResultTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistTracks, playlistResultTracks] = useState([]);

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
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
      <Searchbar searchQuery={searchQuery} onSetSearchQuery={setSearchQuery} onHandleSearch={handleSearch} />
      <div className={styles["track-container"]}>
        <SearchResults tracks={searchResultTracks} />
        <Playlist tracks={playlistTracks} playlistName={playlistName} onSetPlaylistName={setPlaylistName} onSavePlaylist={handleSavePlayList} />
      </div>

    </div>
  );
}
