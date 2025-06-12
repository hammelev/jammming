// TODO: Add styling for SearchResults
// TODO: Add Content to be displayed for a track when it is known what data will be available
// TODO: Add a button to add a track to a playlist
// TODO: Add a button to remove a track from a "draft" play list => Consider if the two bottons can be implemented as a general "action" where the parent provides an action function as well as an icon to display

export default function Track({track}){
    return (
        <div>
            <p>{track.name}</p>
        </div>
    );
}