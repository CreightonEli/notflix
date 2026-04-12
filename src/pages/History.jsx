import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayIcon, TrashIcon, ClockIcon, StarIcon, CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";
import nullPoster from '../assets/nullPoster.png';
import logoSmallShadow from '../assets/logo_small_shadow.png';

export default function History() {
    const [historyList, setHistoryList] = useState([]);
    const [mostRecentFirst, setMostRecentFirst] = useState(true);

    const loadHistory = () => {
        let list = JSON.parse(localStorage.getItem('recentlyWatched') || '[]');
        if (!Array.isArray(list)) list = [];
        // drop any invalid entries that might have crept in
        list = list.filter(item => item && item.id != null);
        setHistoryList(list);
    };

    const removeFromHistory = (id) => {
        const updated = historyList.filter(item => item && item.id !== id);
        setHistoryList(updated);
        localStorage.setItem('recentlyWatched', JSON.stringify(updated));
        const evt = document.createEvent('Event');
        evt.initEvent('historyUpdated', true, true);
        window.dispatchEvent(evt);
    };

    useEffect(() => {
        loadHistory();

        // listen for changes that other components dispatch
        const handler = () => loadHistory();
        window.addEventListener('historyUpdated', handler);
        return () => {
            window.removeEventListener('historyUpdated', handler);
        };
    }, []);

    const sortedList = [...historyList].sort((a, b) => {
        const ta = typeof a.lastUpdated === 'number' ? a.lastUpdated : 0;
        const tb = typeof b.lastUpdated === 'number' ? b.lastUpdated : 0;
        return mostRecentFirst ? tb - ta : ta - tb;
    });

    const toggleOrder = () => setMostRecentFirst(prev => !prev);

    // compact mode toggle
    const [compactMode, setCompactMode] = useState(false);

    function toggleCompactMode() {
        setCompactMode(!compactMode);
        const listElement = document.getElementById('list');
        if (listElement) {
            if (!compactMode) {
                listElement.classList.add('compact');
            } else {
                listElement.classList.remove('compact');
            }
        }
    }

    return (
        <main className="history-page">
            <title>History - Nullflix</title>
            <meta property="og:title" content="History" />
            <meta property="og:site_name" content="Nullflix" />
            <meta name="description" content="Recently watched items on Nullflix." />
            <meta property="og:description" content="Recently watched items on Nullflix." />
            <meta property="og:image" content={`https://nullflix.vercel.app${logoSmallShadow}`} />
            <meta property="og:url" content="https://nullflix.vercel.app/#/history" />
            <meta property="og:type" content="website" />


            <div> 
                {sortedList.length === 0 ? (
                    <div className="history-list">
                        <h2 className="list-title">History</h2>
                        <p>Nothing watched yet.</p>
                    </div>
                ) : (
                    <div id="list" className="history-list">
                        <h2 className="list-title">History</h2>
                        <p>You've seen some... interesting stuff.</p>

                        <div className="list-top">
                            {/* <p>You have (number of items) in your history</p> */}
                            <button className="order-toggle" onClick={toggleOrder}>
                                {mostRecentFirst ? (
                                    <>
                                        Most Recent <CaretUpIcon size={16} weight="fill" />
                                    </>
                                ) : (
                                    <>
                                        Least Recent <CaretDownIcon size={16} weight="fill" />
                                    </>
                                )}
                            </button>
                            <button className="compact-btn" onClick={toggleCompactMode}>
                                Compact Mode
                            </button>
                        </div>
                        <div className="list">
                            <AnimatePresence> // history items

                                {sortedList.map((item, index) => (
                                    <motion.div
                                        className="list-item"
                                        key={item.media_type + item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{
                                            layout: { type: "spring", stiffness: 700, damping: 30, mass: 0.5 },
                                            opacity: { duration: 0.2 },
                                            scale: { type: "spring", stiffness: 700, damping: 30 }
                                        }}
                                    >
                                        {/* {console.log(item)} */}
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
                                                        {item.release_date && <p className="release-year">Released <span className="year">{item.release_date.split('-')[0]}</span></p>}
                                                        {item.first_air_date && <p className="release-year">First Aired <span className="year">{item.first_air_date.split('-')[0]}</span></p>}
                                                        {item.overview && <p className="overview">{item.overview}</p>}
                                                        
                                                        {/* genres */}
                                                        {item.genres && item.genres.length > 0 && (
                                                            <p className="genre-container">
                                                                <span className="media-tag tag">{item.media_type === "movie" ? "Movie" : "TV Show"}</span>
                                                                {item.genres.map((genre) => (
                                                                    <span key={genre.id} className="tag">
                                                                        {genre.name}
                                                                    </span>
                                                                ))}
                                                            </p>
                                                        )}

                                                        <div className="stats">
                                                            {/* Runtime */}
                                                            {item.runtime && (
                                                                <p className="runtime">
                                                                    <ClockIcon weight="bold" />
                                                                    {item.runtime / 60 > 1 && (Math.floor(item.runtime / 60) + 'h ')}
                                                                    {item.runtime % 60}m
                                                                </p>
                                                            )}

                                                            {/* Rating */}
                                                            <p className="rating">
                                                                <StarIcon weight="fill" />
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

                                                        <p className="last-watched">
                                                            {`Last Watched: `}
                                                            <span className="watch-time">
                                                                {item.media_type == 'show' && `S${item.selectedSeason}E${item.selectedEpisode} - `}
                                                                {item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : 'Unknown'}
                                                            </span>
                                                        </p>
                                                        <div className="list-item-buttons">
                                                            <Link to={`/${item.media_type == 'movie' ? 'movies' : 'shows'}/${item.id}`}>
                                                                <button className="play-btn">
                                                                    <PlayIcon size={24} weight="regular" />
                                                                    <span>
                                                                        Watch
                                                                    </span>
                                                                </button>
                                                            </Link>                                                    
                                                            <button className="remove-btn" onClick={() => removeFromHistory(item.id)}>
                                                                <TrashIcon size={24} weight="regular" />
                                                                <span>
                                                                    Remove
                                                                </span>
                                                            </button>                                               
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
