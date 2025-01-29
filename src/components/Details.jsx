import { Link } from "react-router-dom";
import { Star, StarHalf } from "@phosphor-icons/react"

export default function Details(props) {
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

    // Generate Letterboxd slug
    const generateSlug = (title) => {
        if (!title) return "";
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "") // Remove special characters
            .replace(/\s+/g, "-"); // Replace spaces with hyphens
    };

    const letterboxdSlug = generateSlug(props.title);
    const letterboxdUrl = `https://letterboxd.com/film/${letterboxdSlug}/`;

    console.log(props)
    return (
        <div className="banner" style={{backgroundImage: "linear-gradient(360deg, rgb(26, 11, 63) 1%, transparent 100%), url(https://image.tmdb.org/t/p/original" + props.backdrop_path + ")"}}>
            <div className="details-container">
                <img src={"https://image.tmdb.org/t/p/w500" + props.poster_path} alt={"Movie poster for " + props.title} />
                <div className="text-container">
                    <h2>
                        {props.title && (props.title)}
                        {props.name && (props.name)}
                    </h2>
                        {props.release_date && (
                            <span className="year">
                                {props.release_date.split('-')[0]}
                            </span>
                        )}
                        {props.first_air_date && (
                            <span className="year">
                                {props.first_air_date.split('-')[0]}
                            </span>
                        )}
                        {props.credits && (
                            <span className="director">
                                Directed by <span className="name">{props.credits.crew.find(person => person.job === "Director").name}</span>
                            </span>
                        )}
                        {props.tagline && (
                            <p>{(props.tagline).toUpperCase()}</p>
                        )}
                    <p>{props.overview}</p>
                    <p>
                        <span className="media-tag tag">{props.title && ("Movie")}{props.name && ("TV Show")}</span>
                    
                        {props.genres?.map((genre) => (
                            <span key={genre.id} className="tag">
                                {genre.name}
                            </span>
                        )) || <span>Loading...</span>}
                    </p>
                    <div className="bottom">
                        <span className="hero-rating">{starArray[parseInt(props.vote_average)]}</span><p>{props.vote_count} votes</p>
                        {props.title && (
                            <a className="letterboxd-btn" href={letterboxdUrl} target="_blank">
                                <img src="https://a.ltrbxd.com/logos/letterboxd-logo-h-neg-rgb.svg" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}