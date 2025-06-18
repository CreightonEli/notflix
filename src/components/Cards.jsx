import { Link } from "react-router-dom";
import { Star, StarHalf } from "@phosphor-icons/react";
import nullPoster from '../assets/nullPoster.png'; // Use relative path

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
            <div className="card" key={props.id}>
                <div className="card-top">
                    {props.title && (
                        <Link to={`/movies/${props.id}`}>
                            {props.poster_path ? (
                                <img src={"https://image.tmdb.org/t/p/w500/" + props.poster_path} className="movie-cover" />
                            ) : (
                                <img src={nullPoster} className="movie-cover" />
                            )}
                        </Link>
                    )}
                    {props.name && (
                        <Link to={`/shows/${props.id}`}>
                            {props.poster_path ? (
                                <img src={"https://image.tmdb.org/t/p/w500/" + props.poster_path} className="movie-cover" />
                            ) : (
                                <img src={nullPoster} className="movie-cover" />
                            )}
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
                        {props.release_date && (
                            <span className="year">{props.release_date.split('-')[0]}</span>
                        )}
                        {(props.first_air_date && props.first_air_date.split('-')[0]) && (
                            <span className="year">{props.first_air_date.split('-')[0]}</span>
                        )}
                        {props.release_date || props.first_air_date ? (
                            <Star size={14} weight="fill" />
                        ) : (
                            <Star style={{margin: 'auto 0 auto 0'}} size={14} weight="fill" />
                        )}
                        <span className="rating">
                            {Math.round(props.vote_average * 10) / 10}
                        </span>
                        <span className="type">
                            {(props.title && 'Movie') || (props.name && 'TV Show')}
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
}