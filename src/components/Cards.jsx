import { Link } from "react-router-dom";
import { Info, CalendarBlank, Star, StarHalf } from "@phosphor-icons/react";

export default function Cards(props) {
    const starSize = 20;

    const starArray = [
        <><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /></>, 
        <><StarHalf size={starSize} weight="fill" /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /></>, 
        <><Star size={starSize} weight="fill" /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><StarHalf size={starSize} weight="fill" /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><StarHalf size={starSize} weight="fill" /><Star size={starSize} /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><StarHalf size={starSize} weight="fill" /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><StarHalf size={starSize} weight="fill" /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /></>
    ];

    return (
        <>
            {props.poster_path != null && (
                <div className="card" key={props.id}>
                    <div className="card-top">
                        {props.title && (
                            <Link to={`/movies/${props.id}`}>
                                <img src={"https://image.tmdb.org/t/p/w500/" + props.poster_path} className="movie-cover" />
                            </Link>
                        )}
                        {props.name && (
                            <Link to={`/shows/${props.id}`}>
                                <img src={"https://image.tmdb.org/t/p/w500/" + props.poster_path} className="movie-cover" />
                            </Link>
                        )}
                        {/* <img src={"https://image.tmdb.org/t/p/w500/" + props.poster_path} className="movie-cover" /> */}
                        {/* <img src={"https://image.tmdb.org/t/p/w500/" + props.poster_path} className="movie-cover" /> */}
                        {/* <div className="text-content">
                            <h2 className="title">
                                {(props.title || props.name)} 
                            </h2>
                            {(props.release_date && props.release_date.split('-')[0])}
                            {(props.first_air_date && props.first_air_date.split('-')[0])}
                            <div className="cards-rating">{starArray[parseInt(props.vote_average)]}</div>
                            {props.title && (
                                <Link to={`/movies/${props.id}`}>
                                    <button>More info<Info size={18} /></button>
                                </Link>
                            )}
                            {props.name && (
                                <Link to={`/shows/${props.id}`}>
                                    <button>More info<Info size={18} /></button>
                                </Link>
                            )}
                        </div> */}
                    </div>
                    <div className="card-bottom">
                        <h2 className="title">
                            {props.title && (
                                <Link to={`/movies/${props.id}`}>
                                    {props.title}
                                </Link>
                            )}
                            {props.name && (
                                <Link to={`/shows/${props.id}`}>
                                    {props.name}
                                </Link>
                            )}
                        </h2>
                        <p className="quick-info">
                            <span className="year">
                                {/* <CalendarBlank size={16} /> */}
                                {(props.release_date && props.release_date.split('-')[0])}
                                {(props.first_air_date && props.first_air_date.split('-')[0])}
                            </span>
                            <Star size={14} weight="fill" />
                            <span className="rating">
                                {Math.round(props.vote_average * 10) / 10}
                            </span>
                            <span className="type">
                                {(props.title && 'Movie') || (props.name && 'TV Show')}
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}