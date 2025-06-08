// Components
import Tracklist from '../Tracklist/Tracklist';

// TODO: Add styling for SearchResults

export default function SearchResults({tracks}){
    return (
        <div>
            <p>Search Results</p>
            <Tracklist tracks={tracks}/>
        </div>
    );
}