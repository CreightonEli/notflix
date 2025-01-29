import { Link } from "react-router-dom";
import { Info, Star, StarHalf } from "@phosphor-icons/react"
import genres from "../genres"

export default function Hero(props) {

    const starArray = [
        <><Star size={32} /><Star size={32} /><Star size={32} /><Star size={32} /><Star size={32} /></>, 
        <><StarHalf size={32} weight="fill" /><Star size={32} /><Star size={32} /><Star size={32} /><Star size={32} /></>, 
        <><Star size={32} weight="fill" /><Star size={32} /><Star size={32} /><Star size={32} /><Star size={32} /></>,
        <><Star size={32} weight="fill" /><StarHalf size={32} weight="fill" /><Star size={32} /><Star size={32} /><Star size={32} /></>,
        <><Star size={32} weight="fill" /><Star size={32} weight="fill" /><Star size={32} /><Star size={32} /><Star size={32} /></>,
        <><Star size={32} weight="fill" /><Star size={32} weight="fill" /><StarHalf size={32} weight="fill" /><Star size={32} /><Star size={32} /></>,
        <><Star size={32} weight="fill" /><Star size={32} weight="fill" /><Star size={32} weight="fill" /><Star size={32} /><Star size={32} /></>,
        <><Star size={32} weight="fill" /><Star size={32} weight="fill" /><Star size={32} weight="fill" /><StarHalf size={32} weight="fill" /><Star size={32} /></>,
        <><Star size={32} weight="fill" /><Star size={32} weight="fill" /><Star size={32} weight="fill" /><Star size={32} weight="fill" /><Star size={32} /></>,
        <><Star size={32} weight="fill" /><Star size={32} weight="fill" /><Star size={32} weight="fill" /><Star size={32} weight="fill" /><StarHalf size={32} weight="fill" /></>,
        <><Star size={32} weight="fill" /><Star size={32} weight="fill" /><Star size={32} weight="fill" /><Star size={32} weight="fill" /><Star size={32} weight="fill" /></>
    ]

    // Function to get genre names from IDs
    const getGenreNames = (ids) => {
        if (!ids) return [];
        return ids.map((id) => {
            const genre = genres.find((g) => g.id === id); // Match ID with genre
        return genre ? genre.name : "Unknown";
        });
    };

    const genreNames = getGenreNames(props.genre_ids); // Call the function with genre_ids
    
    if (props.media_type == "movie") {
        return (
            <div className="banner" style={{backgroundImage: "linear-gradient(360deg, rgb(26, 11, 63) 1%, transparent 100%), url(https://image.tmdb.org/t/p/original" + props.backdrop_path + ")"}}>
                <div className="hero-container">
                    <img src={"https://image.tmdb.org/t/p/w500" + props.poster_path} alt={"Movie poster for " + props.title} />
                    <div className="text-container">
                        <h2>{props.title}
                            {props.release_date && (
                                <span className="year">
                                    {props.release_date.split('-')[0]}
                                </span>
                            )}
                        </h2>
                        <p>{props.overview}</p>
                        <p><span className="media-tag tag">Movie</span>{genreNames.map((genre, index) => (
                            <span key={index} className="tag">
                                {genre}
                            </span>
                        ))}</p>
                        <div className="bottom">
                            <Link to={`/movies/${props.id}`}>
                                <button><Info size={24} /><span>More info</span></button>
                            </Link>
                            <span className="hero-rating">{starArray[parseInt(props.vote_average)]}</span><p>{props.vote_count} votes</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else { // if show
        return (
            <div className="banner" style={{backgroundImage: "linear-gradient(360deg, rgb(26, 11, 63) 1%, transparent 100%), url(https://image.tmdb.org/t/p/original" + props.backdrop_path + ")"}}>
                <div className="hero-container">
                    <img src={"https://image.tmdb.org/t/p/w500" + props.poster_path} alt={"Cover image for " + props.name} />
                    <div className="text-container">
                        <h2>{props.name}
                            {props.first_air_date && (
                                <span className="year">
                                    {props.first_air_date.split('-')[0]}
                                </span>
                            )}
                        </h2>
                        <p>{props.overview}</p>
                        <p><span className="media-tag tag">TV Show</span>{genreNames.map((genre, index) => (
                            <span key={index} className="tag">
                                {genre}
                            </span>
                        ))}</p>
                        <div className="bottom">
                            <Link to={`/shows/${props.id}`}>
                                <button><Info size={24} /><span>More info</span></button>
                            </Link>
                            <span className="hero-rating">{starArray[parseInt(props.vote_average)]}</span><p>{props.vote_count} votes</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}