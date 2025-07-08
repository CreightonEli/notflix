import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown, Play, Trash, Clock, Star } from "@phosphor-icons/react";
import nullPoster from '../assets/nullPoster.png'; // Use relative path
import logoSmallShadow from '../assets/logo_small_shadow.png';

export default function Lists() {
    const [watchlist, setWatchlist] = useState(
        JSON.parse(localStorage.getItem('watchlist') || '[]')
    );
    const navigate = useNavigate();

    const handleRemove = (id) => {
        const updated = watchlist.filter(item => item.id !== id);
        setWatchlist(updated);
        localStorage.setItem('watchlist', JSON.stringify(updated));
    };

    // Move item up in the array
    const handleMoveUp = (index) => {
        if (index === 0) return;
        const updated = [...watchlist];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        setWatchlist(updated);
        localStorage.setItem('watchlist', JSON.stringify(updated));
    };

    // Move item down in the array
    const handleMoveDown = (index) => {
        if (index === watchlist.length - 1) return;
        const updated = [...watchlist];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        setWatchlist(updated);
        localStorage.setItem('watchlist', JSON.stringify(updated));
    };

    return (
        <main className="watchlist-page">

            <title>Watchlist - Notflix</title>
            <meta property="og:title" content="Watchlist" />
            <meta property="og:site_name" content="Notflix" />
            <meta name="description" content="Watchlist page of Notflix, showcasing user's watchlist." />
            <meta property="og:description" content="Watchlist page of Notflix, showcasing user's watchlist." />
            <meta property="og:image" content={`https://creightoneli.github.io${logoSmallShadow}`} />
            <meta property="og:url" content="https://creightoneli.github.io/notflix/#/lists" />
            <meta property="og:type" content="website" />

            <div>
                {watchlist.length === 0 ? (
                    <div className="watchlist">
                        <h2 className="list-title">Watchlist</h2>
                        <p>Your watchlist is empty.</p>
                    </div>
                ) : (
                    <div className="watchlist">
                        <h2 className="list-title">Watchlist</h2>
                        <p>What will you watch next?</p>
                        <AnimatePresence>
                            {watchlist.map((item, index) => (
                                <motion.div
                                    className="list-item"
                                    key={item.media_type + item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    whileHover={{ scale: 1.02, /*boxShadow: "0 8px 32px -8px var(--purple)"*/ }}
                                    // whileTap={{ scale: 0.97 }}
                                    transition={{
                                        layout: {
                                            type: "spring",
                                            stiffness: 700,
                                            damping: 30,
                                            mass: 0.5
                                        },
                                        opacity: { duration: 0.2 },
                                        scale: { type: "spring", stiffness: 700, damping: 30 }
                                    }}
                                >
                                    <div className="list-item-bg" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${item.backdrop_path})` }}>
                                        <div>
                                            <div className="poster-wrapper">
                                                <img
                                                    className="poster"
                                                    src={item.poster_path == null ? nullPoster : `https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                                                    alt={item.title || item.name}
                                                />
                                            </div>

                                            <div className="list-item-info">
                                                
                                                {/* Item logo */}
                                                {item?.images?.logos[0]?.file_path ?
                                                    <img className="logo" src={`https://image.tmdb.org/t/p/w300${item?.images?.logos[0]?.file_path}`} alt={`Logo for ${item.title || item.name}`} />
                                                    :
                                                    <h2 className="title">
                                                        {item.title && (item.title)}
                                                        {item.name && (item.name)}
                                                    </h2>
                                                }

                                                <div>

                                                    {/* Film Director / Show Creator */}
                                                    {item.credits && (
                                                        item?.credits?.crew.find(person => person.job === "Director") && (
                                                            <p className="director">
                                                                Directed by <span className="name">
                                                                    <Link to={`/person/${item?.credits?.crew.find(person => person.job === "Director").id}`}>
                                                                        {item?.credits?.crew.find(person => person.job === "Director")?.name}
                                                                    </Link>
                                                                </span>
                                                            </p>
                                                        )
                                                    )}
                                                    {item?.created_by?.length > 0 && (
                                                        item?.created_by.length > 1 ? (
                                                            <p className="director">
                                                                Created by <span className="name"><Link to={`/person/${item?.created_by[0]?.id}`}>{item?.created_by[0]?.name}</Link></span> and <span className="name"><Link to={'/person/' + item?.created_by[1]?.id}>{item?.created_by[1]?.name}</Link></span>
                                                            </p>
                                                        ) : (
                                                            <p className="director">
                                                                Created by <span className="name"><Link to={`/person/${item?.created_by[0]?.id}`}>{item?.created_by[0]?.name}</Link></span>
                                                            </p>
                                                        )
                                                    )}
                                                    {/* Release Year */}
                                                    {item.release_date && (
                                                        <p className="release-year">
                                                            {new Date(item.release_date) > new Date() ? (
                                                                <>Set to release on <span className="year">{new Date(item.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                                                            ) : (
                                                                <>Released <span className="year">{item.release_date.split('-')[0]}</span></>
                                                            )}
                                                        </p>
                                                    )}
                                                    {item.first_air_date && (
                                                        <p className="release-year">
                                                            {new Date(item.first_air_date) > new Date() ? (
                                                                <>Set to air on <span className="year">{new Date(item.first_air_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                                                            ) : (
                                                                <>First aired <span className="year">{item.first_air_date.split('-')[0]}</span></>
                                                            )}
                                                        </p>
                                                    )}

                                                    {/* Overview */}
                                                    <p className="overview">{item.overview}</p>
                                                    
                                                    {/* Genres */}
                                                    <p className="genre-container">
                                                        <span className="media-tag tag">{item.media_type === "movie" ? "Movie" : "TV Show"}</span>
                                                        {item.genres?.map((genre) => (
                                                            <span key={genre.id} className="tag">
                                                                {genre.name}
                                                            </span>
                                                        )) || <span>Loading...</span>}
                                                    </p>
                                                    
                                                    <div className="stats">
                                                        {/* Runtime */}
                                                        {item.runtime && (
                                                            <p className="runtime">
                                                                <Clock weight="bold" />
                                                                {item.runtime / 60 > 1 && (Math.floor(item.runtime / 60) + 'h ')}
                                                                {item.runtime % 60}m
                                                            </p>
                                                        )}

                                                        {/* Rating */}
                                                        <p className="rating">
                                                            <Star weight="fill" />
                                                            <span className="rating-value">{Math.round(item.vote_average * 10) / 10}</span>                                                            
                                                        </p>
                                                    
                                                        {/* number of votes */}
                                                        <p className="votes">
                                                            {item.vote_average > 0 ? (
                                                                <>
                                                                    {item.vote_count.toLocaleString('en', {useGrouping:true})} ratings
                                                                </>
                                                            ) : (
                                                                <>
                                                                    No ratings
                                                                </>
                                                            )}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="list-item-buttons">
                                                        {/* Play button */}
                                                        <Link to={`/${item.media_type == 'movie' ? 'movies' : 'shows'}/${item.id}`}>
                                                            <button className="play-btn">
                                                                <Play size={24} weight="regular" />
                                                                Watch
                                                            </button>
                                                        </Link>

                                                        {/* Remove from Watchlist Button */}
                                                        <button
                                                            className="remove-btn"
                                                            onClick={() => handleRemove(item.id)}
                                                        >
                                                            <Trash size={24} weight="regular" />
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="list-item-controls">
                                                <button
                                                    className={`up-btn${index === 0 ? " disabled" : ""}`}
                                                    onClick={() => handleMoveUp(index)}
                                                    disabled={index === 0}
                                                >
                                                    <ArrowUp size={24} />
                                                </button>
                                                <div className="item-number">
                                                    {index + 1}
                                                </div>
                                                <button
                                                    className={`down-btn${index === watchlist.length - 1 ? " disabled" : ""}`}
                                                    onClick={() => handleMoveDown(index)}
                                                    disabled={index === watchlist.length - 1}
                                                >
                                                    <ArrowDown size={24} />
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </main>
    );
}
