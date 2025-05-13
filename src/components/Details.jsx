import { Clock, Star, StarHalf, PlayCircle, MagnifyingGlassPlus } from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Details(props) {
    const [activeMedia, setActiveMedia] = useState(
        props.videos?.results?.length > 0 ? "videos" : "images"
    ); // Default to "videos" if available, otherwise "images"

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
        <>
            <div className="details-container">
                <img src={"https://image.tmdb.org/t/p/w500" + props.poster_path} alt={`Poster for the ${props.title ? 'movie' : 'show'} ${props.title || props.name}`} />
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
                                <>Set to release in <span className="year">{new Date(props.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                            ) : (
                                <>Released <span className="year">{props.release_date.split('-')[0]}</span></>
                            )}
                        </p>
                    )}
                    {props.first_air_date && (
                        <p className="date">
                            {new Date(props.first_air_date) > new Date() ? (
                                <>Set to air in <span className="year">{new Date(props.first_air_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                            ) : (
                                <>First aired <span className="year">{props.first_air_date.split('-')[0]}</span></>
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
            {(props.videos?.results?.length > 0 || props.images?.backdrops?.length > 0) && (
                <div className="media-container">
                    <div className="media-header">
                        <h2>Media</h2>
                        {props.videos?.results?.length > 0 && (
                            <h3 
                                className={activeMedia === "videos" ? "active" : ""} 
                                onClick={() => setActiveMedia("videos")}
                            >
                                Videos <span>{props.videos.results.length}</span>
                            </h3>
                        )}
                        {props.images?.backdrops?.length > 0 && (
                            <h3 
                                className={activeMedia === "images" ? "active" : ""} 
                                onClick={() => setActiveMedia("images")}
                            >
                                Images <span>{props.images.backdrops.length}</span>
                            </h3>
                        )}
                    </div>                        
                    <div className="media-gallery">
                        {activeMedia === "videos" && props.videos?.results?.map((video, index) => (
                            <a href={`https://www.youtube.com/watch?v=${video.key}`} target="_blank" key={index}>
                                <PlayCircle size={50} weight="fill" />
                                <img src={`https://img.youtube.com/vi/${video.key}/0.jpg`} alt={`Trailer ${index + 1}`} />
                            </a>
                        ))}
                        {activeMedia === "images" && props.images?.backdrops?.map((image, index) => (
                            <a href={`https://image.tmdb.org/t/p/original${image.file_path}`} target="_blank" key={index}>
                                <MagnifyingGlassPlus size={50} />
                                <img key={index} src={`https://image.tmdb.org/t/p/w500${image.file_path}`} alt={`Backdrop ${index + 1}`} />
                            </a>
                        ))}
                    </div>
                </div>
            )}
            {props.title && (
                <a className="letterboxd-btn" href={letterboxdUrl} target="_blank">
                    <img src="https://a.ltrbxd.com/logos/letterboxd-logo-h-neg-rgb.svg" />
                </a>
            )}
        </>
    );
}