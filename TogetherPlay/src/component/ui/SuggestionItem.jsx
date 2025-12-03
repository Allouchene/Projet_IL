import {usePlaylist} from "../../context/HomePlaylistContext.jsx";

export default function SuggestionItem() {

    const {items, setItems} = usePlaylist();

    function handleAddItem() {

    }
    return (
        <article className="suggestion-card">
            <div className="suggestion-thumbnail">
                <img src="TogetherPlay/src/assets/images/youtube.jpg"
                     alt="Ce milliardaire a tout perdu à cause d'un caprice..."/>
            </div>
            <div className="suggestion-info">
                <p className="suggestion-title">
                    Ce milliardaire a tout perdu à cause d'un caprice...
                </p>
                <button type="button" className="add-to-playlist-btn" aria-label="Ajouter à la playlist">
                    <span className="material-symbols-outlined">add</span>
                </button>
            </div>
        </article>
    )
}