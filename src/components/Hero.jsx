import { Link } from "react-router-dom";
import { Info, Star, StarHalf } from "@phosphor-icons/react"
import genres from "../genres"
import React, { useEffect, useState } from 'react';
import useApiKey from '../hooks/useApiKey';

export default function Hero(props) {
    const [images, setImages] = useState(null); // Store only the relevant logo path
    const [isDataFetched, setIsDataFetched] = useState(false); // Track if data has been fetched
    const [apiKey, setApiKey] = useApiKey();

    useEffect(() => {
        // Only fetch images once we have settled props.id and props.media_type
        if (!props.id || !props.media_type || isDataFetched) return;
    
        const fetchImages = async () => {
          const options = {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          };
    
          try {
            const endpoint =
              props.media_type === "movie"
                ? `https://api.themoviedb.org/3/movie/${props.id}/images?include_image_language=en%2Cnull`
                : `https://api.themoviedb.org/3/tv/${props.id}/images?include_image_language=en%2Cnull`;
    
            const response = await fetch(endpoint, options);
            const data = await response.json();
    
            if (data && props.id) {
              setImages({ id: props.id, logos: data.logos });
              setIsDataFetched(true); // Mark as fetched
            }
          } catch (error) {
            console.error("Error fetching images:", error);
          }
        };
    
        fetchImages();
    }, [props.id, props.media_type, isDataFetched]);

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
    
    // console.log(props)
    
    return (
        <div className="banner" style={{backgroundImage: "linear-gradient(360deg, rgb(26, 11, 63) 1%, transparent 100%), url(https://image.tmdb.org/t/p/original" + props.backdrop_path + ")"}}>
            <div className="hero-container">
                <img src={"https://image.tmdb.org/t/p/w500" + props.poster_path} alt={"Movie poster for " + props.title} />
                <div className="text-container">
                    {images?.id === props.id && images?.logos?.[0]?.file_path ? 
                        // <div className="logo-container">
                            <img src={`https://image.tmdb.org/t/p/w500${images?.logos[0]?.file_path}`} alt={`Logo for ${props?.title || props?.name}`} />
                        // </div>
                        :
                        <h2>
                            {props.title && (props.title)}
                            {props.name && (props.name)}
                        </h2>
                    }
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
                    <p className="clamped">{props.overview}</p>
                    <div className="genre-container">
                        <span className="media-tag tag">{props.media_type == 'movie' ? 'Movie' : 'TV Show'}</span>
                        {genreNames.map((genre, index) => (
                            <span key={index} className="tag">
                                {genre}
                            </span>)
                        )}
                    </div>
                    <div className="bottom">
                        <Link to={`/${props.media_type === 'movie' ? 'movies' : 'shows'}/${props.id}`}>
                            <button><Info size={24} weight="bold" /><span>More info</span></button>
                        </Link>
                        <div className="quick-info">
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
        </div>
    )
}