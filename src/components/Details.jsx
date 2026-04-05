import { Clock, Star, StarHalf, } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import nullPosterBig from '../assets/nullPosterBig.png'; // Use relative path

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
    ];

    return (
        <>
            <div className="details-container">
                {props.poster_path ? (
                    <img src={"https://image.tmdb.org/t/p/w500" + props.poster_path} alt={`Poster for the ${props.title ? 'movie' : 'show'} ${props.title || props.name}`} />
                ) : (
                    <img src={nullPosterBig} alt={"No poster available for " + props.title || props.name} />
                )}
                <div className="text-container">
                    {props?.images?.logos[0]?.file_path ? 
                        <img src={`https://image.tmdb.org/t/p/w500${props?.images?.logos[0]?.file_path}`} alt={`Logo for ${props.title || props.name}`} />
                        :
                        <h2>
                            {props.title && (props.title)}
                            {props.name && (props.name)}
                        </h2>
                    }
                    {props.credits && (
                        props?.credits?.crew.find(person => person.job === "Director") && (
                            <p className="director">
                                Directed by <span className="name">
                                    <Link to={`/person/${props?.credits?.crew.find(person => person.job === "Director").id}`}>
                                        {props?.credits?.crew.find(person => person.job === "Director")?.name}
                                    </Link>
                                </span>
                            </p>
                        )
                    )}
                    {props?.created_by?.length > 0 && (
                        props?.created_by.length > 1 ? (
                            <p className="director">
                                Created by <span className="name"><Link to={`/person/${props?.created_by[0]?.id}`}>{props?.created_by[0]?.name}</Link></span> and <span className="name"><Link to={'/person/' + props?.created_by[1]?.id}>{props?.created_by[1]?.name}</Link></span>
                            </p>
                        ) : (
                            <p className="director">
                                Created by <span className="name"><Link to={`/person/${props?.created_by[0]?.id}`}>{props?.created_by[0]?.name}</Link></span>
                            </p>
                        )
                    )}
                    {props.release_date && (
                        <p className="date">
                            {new Date(props.release_date) > new Date() ? (
                                <>Set to release on <span className="year">{new Date(props.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                            ) : (
                                <>Released <span className="year">{new Date(props.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                            )}
                        </p>
                    )}
                    {props.first_air_date && (
                        <p className="date">
                            {new Date(props.first_air_date) > new Date() ? (
                                <>Set to air on <span className="year">{new Date(props.first_air_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                            ) : (
                                <>First aired <span className="year">{new Date(props.first_air_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                            )}
                        </p>
                    )}
                    {props.tagline && (
                        <p className="tagline">{(props.tagline).toUpperCase()}</p>
                    )}
                    <p className="overview">{props.overview}</p>
                    <p className="genre-container">
                        <span className="media-tag tag">{props.title && ("Movie")}{props.name && ("TV Show")}</span>
                    
                        {props.genres?.map((genre) => (
                            <span key={genre.id} className="tag">
                                {genre.name}
                            </span>
                        )) || <span>Loading...</span>}
                    </p>
                    <div className="bottom">
                        <div className="quick-info">
                            {/* runtime */}
                            {props.runtime && (
                                <span className="info-item runtime">
                                    <Clock weight="bold" />
                                    {props.runtime / 60 > 1 && (Math.floor(props.runtime / 60) + 'h ')}
                                    {props.runtime % 60}m
                                </span>
                            )}
                            {/* rating average */}
                            <span className="info-item rating-avg">
                                <Star weight="fill"/>
                                <span className="rating-num">
                                    {Math.round(props.vote_average * 10) / 10}
                                </span>
                            </span>
                            {/* number of ratings */}
                            <span className="info-item">
                                <span className="vote-count-text">
                                    {props.vote_average > 0 ? (
                                        <>
                                            {props.vote_count.toLocaleString('en', {useGrouping:true})} ratings
                                        </>
                                    ) : (
                                        <>
                                            No ratings
                                        </>
                                    )}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}