import {useState} from 'react';

// Components
import Playlist from '../Playlist/Playlist';
import Searchbar from '../Searchbar/Searchbar';
import SearchResults from '../SearchResults/SearchResults';

// TODO: Improve styling of the App e.g. header bar with title of the application and bacground.
// Styles
import styles from './app.module.css';

// TODO: Call spotifyService to authenticate, search for tracks and create playlist
export default function App() {
  const [searchResultTracks, setSearchResultTracks] = useState([]);
  const [playlistTracks, playlistResultTracks] = useState([]);

  return (
    <div className={styles.App}>
      <header className={styles["App-header"]}>
        <p>
          Jammming
        </p>
      </header>
      <Searchbar />
      <div className={styles["Track-container"]}>
        <SearchResults tracks={searchResultTracks} />
        <Playlist tracks={playlistTracks} />
      </div>

    </div>
  );
}
