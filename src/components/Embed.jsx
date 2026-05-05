import Details from '../components/Details'
import Collection from './Collection';
import Media from "./Media";
import Providers from './Providers';
import React, { useEffect, useState, useRef } from 'react';
import { PlayCircle, CornersOut, CornersIn, HeartIcon, HeartBreakIcon, StarIcon } from "@phosphor-icons/react";
import { useHeaderVisibility } from '../context/HeaderVisibilityContext';
import useApiKey from '../hooks/useApiKey';
import providersData from '../providers.json';
import nullThumbail from '../assets/nullThumbnail.png'; // Use relative path

export default function Embed(props) {
    const { isHeaderVisible, setIsHeaderVisible } = useHeaderVisibility();
    const [seasonData, setSeasonData] = useState([]); // State to store episode data
    const [selectedSeason, setSelectedSeason] = useState(1); // State to store currently viewed season
    const [selectedEpisode, setSelectedEpisode] = useState(1); // State to store selected episode number
    const [selectedEpisodeSeason, setSelectedEpisodeSeason] = useState(1); // season that contains the selected episode
    const [selectedSource, setSelectedSource] = useState(''); // State to store selected source
    const [isTheaterMode, setIsTheaterMode] = useState(false); // State for theater mode
    const [apiKey, setApiKey] = useApiKey();
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [defaultMovieProvider, setDefaultMovieProvider] = useState(0);
    const [defaultShowProvider, setDefaultShowProvider] = useState(0);
    const [watchedEpisodes, setWatchedEpisodes] = useState({}); // { season: [episodes] }
    const playerRef = useRef(null);

    const isMovie = !!props.title;

    // Load default providers from localStorage
    useEffect(() => {
        const savedMovieProvider = localStorage.getItem('defaultMovieProvider');
        const savedShowProvider = localStorage.getItem('defaultShowProvider');
        setDefaultMovieProvider(savedMovieProvider !== null ? parseInt(savedMovieProvider, 10) : 0);
        setDefaultShowProvider(savedShowProvider !== null ? parseInt(savedShowProvider, 10) : 0);
    }, []);

    // Function to replace placeholders in URL
    const buildUrl = (template, id, season = null, episode = null) => {
        let url = template.replace('{id}', id);
        if (season !== null && season !== undefined) {
            url = url.replace('{season}', season);
        }
        if (episode !== null && episode !== undefined) {
            url = url.replace('{episode}', episode);
        }
        return url;
    };

    // Get providers based on type
    const providers = isMovie ? providersData.movieProviders : providersData.showProviders;

    // compute watched episodes set for current season (shows only)
    // derive from state so component will rerender when watchedEpisodes changes
    const watchedSet = React.useMemo(() => {
        if (isMovie) return new Set();
        return new Set(watchedEpisodes[selectedSeason] || []);
    }, [isMovie, watchedEpisodes, selectedSeason]);

    let defaultURL = 'https://vidsrc.cc/v3/embed/movie/1?autoPlay=false';
    if (isMovie) {
        defaultURL = buildUrl(providers[defaultMovieProvider]?.url || providers[0].url, props.id);
    } else {
        // when selectedEpisode could be null, fall back to 1 for building this placeholder value
        const ep = selectedEpisode != null ? selectedEpisode : 1;
        defaultURL = buildUrl(providers[defaultShowProvider]?.url || providers[0].url, props.id, selectedSeason, ep);
    }

    useEffect(() => { // fetch season data when selectedSeason changes
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
        };

        fetch(`https://api.themoviedb.org/3/tv/${props.id}/season/${selectedSeason}?language=en-US`, options)
            .then((response) => response.json()) // Parse JSON response
            .then((data) => setSeasonData(data)) // Save `results` to state
            .catch((err) => console.error(err));
    }, [props.id, selectedSeason]);

    // record movie/show info when page loads or id changes
    const updateRecentlyWatchedMovie = () => {
        // guard against invalid props
        if (!props.id) return;
        const list = JSON.parse(localStorage.getItem('recentlyWatched') || '[]');
        const index = list.findIndex(item => item.id === props.id && item.media_type === 'movie');
        const baseEntry = {
            id: props.id,
            title: props.title,
            name: props.name,
            media_type: 'movie',
            poster_path: props.poster_path,
            backdrop_path: props.backdrop_path,
            overview: props.overview,
            vote_average: props.vote_average,
            vote_count: props.vote_count,
            release_date: props.release_date,
            runtime: props.runtime,
            genres: props.genres,
            credits: props.credits,
            created_by: props.created_by,
            images: props.images, // store logos etc.
            lastUpdated: Date.now(),
            lastViewed: Date.now(),
        };
        if (index !== -1) {
            list[index] = { ...list[index], ...baseEntry, lastViewed: Date.now() };
        } else {
            list.push(baseEntry);
        }
        // Limit to 50 entries, keeping the most recent
        if (list.length > 50) {
            list.splice(0, list.length - 50);
        }
        localStorage.setItem('recentlyWatched', JSON.stringify(list));
        // notify listeners that history updated
        const evt2 = document.createEvent('Event');
        evt2.initEvent('historyUpdated', true, true);
        window.dispatchEvent(evt2);
    };

    const updateRecentlyWatchedShow = (season, episodeNumber) => {
        if (!props.id || season == null || episodeNumber == null) return;
        const list = JSON.parse(localStorage.getItem('recentlyWatched') || '[]');
        const index = list.findIndex(item => item.id === props.id && item.media_type === 'show');
        const episodeEntry = {
            id: props.id,
            name: props.name,
            media_type: 'show',
            poster_path: props.poster_path,
            backdrop_path: props.backdrop_path,
            overview: props.overview,
            vote_average: props.vote_average,
            vote_count: props.vote_count,
            first_air_date: props.first_air_date,
            runtime: props.runtime,
            genres: props.genres,
            credits: props.credits,
            created_by: props.created_by,
            images: props.images,
            watchedEpisodes: {},
            selectedSeason: season,
            selectedEpisode: episodeNumber,
            lastUpdated: Date.now(),
            lastViewed: Date.now(),
        };
        if (index === -1) {
            episodeEntry.watchedEpisodes = { [season]: [episodeNumber] };
            list.push(episodeEntry);
        } else {
            const entry = list[index];
            const watched = entry.watchedEpisodes || {};
            const seasonSet = new Set(watched[season] || []);
            seasonSet.add(episodeNumber);
            watched[season] = Array.from(seasonSet);
            entry.watchedEpisodes = watched;
            entry.selectedSeason = season;
            entry.selectedEpisode = episodeNumber;
            entry.lastUpdated = Date.now();
            entry.lastViewed = Date.now();
            list[index] = entry;
        }
        // Limit to 50 entries, keeping the most recent
        if (list.length > 50) {
            list.splice(0, list.length - 50);
        }
        localStorage.setItem('recentlyWatched', JSON.stringify(list));
        // Update local state
        setWatchedEpisodes(prev => ({
            ...prev,
            [season]: Array.from(new Set([...(prev[season] || []), episodeNumber]))
        }));
        // notify listeners (e.g., history page) that storage changed
        const evt = document.createEvent('Event');
        evt.initEvent('historyUpdated', true, true);
        window.dispatchEvent(evt);
    };

    useEffect(() => {
        // when the id changes we want to restore the last selected season/episode for shows
        let season = 1;
        let episode = 1;
        let initialWatched = {};

        if (!isMovie) {
            const list = JSON.parse(localStorage.getItem('recentlyWatched') || '[]');
            const entry = list.find(item => item.id === props.id && item.media_type === 'show');
            if (entry) {
                if (entry.selectedSeason && entry.selectedEpisode) {
                    season = entry.selectedSeason;
                    episode = entry.selectedEpisode;
                }
                // preload watchedEpisodes state
                initialWatched = entry.watchedEpisodes || {};
            }
        }

        setSelectedSeason(season);
        setSelectedEpisode(episode);
        setSelectedEpisodeSeason(season);
        setWatchedEpisodes(initialWatched);

        // build the initial source using whatever season/episode we chose above
        const initial = isMovie
            ? buildUrl(providers[defaultMovieProvider]?.url || providers[0].url, props.id)
            : buildUrl(providers[defaultShowProvider]?.url || providers[0].url, props.id, season, episode);
        setSelectedSource(initial);

        if (isMovie) {
            updateRecentlyWatchedMovie();
        } else {
            // record show episode (could be restored or default 1/1)
            updateRecentlyWatchedShow(season, episode);
        }
    }, [props.id]);

    useEffect(() => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        setIsWatchlisted(watchlist.some(item => item.id === props.id));
    }, [props.id]);

    const constructSourceUrl = (baseUrl, season, episode) => {
        // replace season/episode segments even when query params are present
        if (baseUrl.includes('embed.su')) {
            return baseUrl.replace(/\/\d+\/\d+(?=\?|$)/, `/${season}/${episode}`);
        } else if (baseUrl.includes('vidsrc.cc')) {
            if (baseUrl.includes('anime')) {
                // anime urls have the episode number before sub/dub
                return baseUrl.replace(/\/\d+\/(sub|dub)(?=\?)/, `/${episode}/$1`);
            } else {
                return baseUrl.replace(/\/\d+\/\d+(?=\?|$)/, `/${season}/${episode}`);
            }
        } else if (baseUrl.includes('vidsrc.me')) {
            const url = new URL(baseUrl);
            url.searchParams.set('season', season);
            url.searchParams.set('episode', episode);
            return url.toString();
        } else if (baseUrl.includes('vidlink.pro')) {
            // urls use ? or & before query string, handle both
            return baseUrl.replace(/\/\d+\/\d+(?=\?|&|$)/, `/${season}/${episode}`);
        }
        return baseUrl;
    };

    const updateSource = (source) => {
        const newSource = constructSourceUrl(source, selectedSeason, selectedEpisode);
        setSelectedSource(newSource);
    };

    const handleSourceChange = (event) => {
        const selectedIndex = parseInt(event.target.value, 10);
        const selectedProvider = providers[selectedIndex];
        const newSource = buildUrl(selectedProvider.url, props.id, selectedSeason, selectedEpisode);
        setSelectedSource(newSource);
        
        // Save as default
        if (isMovie) {
            setDefaultMovieProvider(selectedIndex);
            localStorage.setItem('defaultMovieProvider', selectedIndex.toString());
        } else {
            setDefaultShowProvider(selectedIndex);
            localStorage.setItem('defaultShowProvider', selectedIndex.toString());
        }
    };

    const handleSeasonChange = (event) => {
        const newSeason = Number(event.target.value);
        setSelectedSeason(newSeason);
        // do NOT touch selectedEpisode; we keep a single episode selection for the show.
        // the render logic will only mark it as selected when the displayed season matches.
    };

    const handleEpisodeClick = (episodeNumber) => {
        setSelectedEpisode(episodeNumber);
        setSelectedEpisodeSeason(selectedSeason);
        
        const providerIndex = isMovie ? defaultMovieProvider : defaultShowProvider;
        const provider = providers[providerIndex];

        const newSource = buildUrl(
            provider.url,
            props.id,
            selectedSeason,
            episodeNumber
        );

        setSelectedSource(newSource);

        // Scroll to player
        playerRef.current?.scrollIntoView({ behavior: 'smooth' });
        // record show episode
        if (!isMovie) {
            updateRecentlyWatchedShow(selectedSeason, episodeNumber);
        }
    };

    // toggle watched flag for an episode via right-click
    const toggleWatchedEpisode = (season, episodeNumber) => {
        setWatchedEpisodes(prev => {
            const seasonArr = prev[season] ? [...prev[season]] : [];
            const index = seasonArr.indexOf(episodeNumber);
            let newSeasonArr;
            if (index === -1) {
                newSeasonArr = [...seasonArr, episodeNumber];
            } else {
                newSeasonArr = seasonArr.filter(e => e !== episodeNumber);
            }
            const newState = { ...prev, [season]: newSeasonArr };
            // persist change to localStorage as well
            const list = JSON.parse(localStorage.getItem('recentlyWatched') || '[]');
            const entry = list.find(item => item.id === props.id && item.media_type === 'show');
            if (entry) {
                const watched = entry.watchedEpisodes || {};
                watched[season] = newSeasonArr;
                entry.watchedEpisodes = watched;
                localStorage.setItem('recentlyWatched', JSON.stringify(list));
            }
            return newState;
        });
    };

    const toggleTheaterMode = () => {
        setIsTheaterMode(!isTheaterMode);
        setIsHeaderVisible(isTheaterMode); // Hide header when entering theater mode
    };

    const handleAddToWatchlist = () => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        const index = watchlist.findIndex(item => item.id === props.id);

        if (index === -1) {
            // Not in watchlist, add it
            watchlist.push({
                id: props.id,
                title: props.title,
                name: props.name,
                media_type: props.title ? 'movie' : 'show',
                poster_path: props.poster_path,
                backdrop_path: props.backdrop_path,
                images: props.images,
                overview: props.overview,
                vote_average: props.vote_average,
                vote_count: props.vote_count,
                release_date: props.release_date,
                first_air_date: props.first_air_date,
                runtime: props.runtime,
                genres: props.genres,
                credits: props.credits,
                created_by: props.created_by,
            });
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            setIsWatchlisted(true);
        } else {
            // Already in watchlist, remove it
            watchlist.splice(index, 1);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            setIsWatchlisted(false);
        }
        // notify listeners that watchlist changed
        const evt = document.createEvent('Event');
        evt.initEvent('watchlistUpdated', true, true);
        window.dispatchEvent(evt);
    };

    // generate letterboxd slug and url
    const generateSlug = (title) => {
    if (!title) return "";
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters
        .replace(/\s+/g, "-"); // Replace spaces with hyphens
    };

    const letterboxdSlug = generateSlug(props.title);
    const letterboxdUrl = `https://letterboxd.com/film/${letterboxdSlug}/`;

    // console.log(seasonData)

    return (
        <div>
            <div
                ref={playerRef}
                className="banner"
                style={{
                    backgroundImage: `linear-gradient(0deg, rgb(26, 11, 63) 1%, ${
                        isTheaterMode ? 'rgba(0, 0, 0, 0.88)' : 'rgba(0, 0, 0, 0)'
                    } 100%), url(https://image.tmdb.org/t/p/original${props.backdrop_path})`,
                }}
            >
                <section className="embed-section">
                    <div className={`embed-wrapper ${isTheaterMode ? 'theater-mode' : ''}`}>
                        <div>
                            <iframe
                                key={selectedSource}
                                src={selectedSource}
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </section>

                {props.title && (
                    <div className="source-container">
                        <div className="source-control">
                            <select name="source" id="source" onChange={handleSourceChange} value={isMovie ? defaultMovieProvider : defaultShowProvider}>
                                {providers.map((provider, index) => (
                                    <option key={index} value={index}>{provider.name}</option>
                                ))}
                            </select>
                            <button
                                className={`watchlist-btn${isWatchlisted ? ' active' : ''}`}
                                onClick={handleAddToWatchlist}
                            >
                                {isWatchlisted ? (
                                    <HeartIcon size={21} weight="fill" />
                                ) : (
                                    <HeartBreakIcon size={21} weight="fill" />
                                )}
                                <span className={isWatchlisted ? 'active' : ''}>
                                    {isWatchlisted ? 'Added to My List' : 'Add to My List'}
                                </span>
                            </button>
                            <button
                                className={`theater-mode ${isTheaterMode ? 'active' : ''}`}
                                onClick={toggleTheaterMode}
                            >
                                {isTheaterMode ? (
                                    <>
                                        <span>Theater Mode</span>
                                        <CornersIn size={21} />
                                    </>
                                ) : (
                                    <>
                                        <span>Theater Mode</span>
                                        <CornersOut size={21} />
                                    </>
                                )}
                            </button>
                        </div>
                        <Details {...props} />

                        {/* Legit Stream provider list */}
                        <Providers {...props}/>

                        {/* media gallery */}
                        {(props.videos?.results?.length > 0 || props.images?.backdrops?.length > 0 || props.images?.posters?.length > 0 || props.images?.logos?.length > 0) && (
                            <Media {...props} />
                        )}

                        {/* Collection Component */}
                        {props.belongs_to_collection && ( // display collection when it exists.
                            <Collection {...props} />
                        )}

                        {/* Letterboxd button */}
                        {props.title && (
                            <a className="letterboxd-btn" href={letterboxdUrl} target="_blank">
                                <img src="https://a.ltrbxd.com/logos/letterboxd-logo-h-neg-rgb.svg" />
                            </a>
                        )}
                    </div>
                )}
            </div>
                {props.name && (
                    <div className="episode-selector">
                        <div className="source-control">
                            <select name="source" id="source" onChange={handleSourceChange} value={isMovie ? defaultMovieProvider : defaultShowProvider}>
                                {providers.map((provider, index) => (
                                    <option key={index} value={index}>{provider.name}</option>
                                ))}
                            </select>
                            <button
                                className={`watchlist-btn${isWatchlisted ? ' active' : ''}`}
                                onClick={handleAddToWatchlist}
                            >
                                {isWatchlisted ? (
                                    <HeartIcon size={21} weight="fill" />
                                ) : (
                                    <HeartBreakIcon size={21} weight="fill" />
                                )}
                                <span className={isWatchlisted ? 'active' : ''}>
                                    {isWatchlisted ? 'Added to My List' : 'Add to My List'}
                                </span>
                            </button>
                            <button
                                className={`theater-mode ${isTheaterMode ? 'active' : ''}`}
                                onClick={toggleTheaterMode}
                            >
                                {isTheaterMode ? (
                                    <>
                                        <span>Theater Mode</span>
                                        <CornersIn size={21} />
                                    </>
                                ) : (
                                    <>
                                        <span>Theater Mode</span>
                                        <CornersOut size={21} />
                                    </>
                                )}
                            </button>
                        </div>
                        <Details {...props} />

                        {/* Legit Stream provider list */}
                        <Providers {...props}/>
                        
                        <div className="heading">
                            <h2>Seasons</h2>
                            <select name="seasons" id="seasons" value={selectedSeason} onChange={handleSeasonChange}>
                                {props.seasons.map(
                                    (season, index) =>
                                        season.season_number > 0 && (
                                            <option value={season.season_number} key={season.id}>
                                                {season.name}
                                            </option>
                                        )
                                )}
                            </select>
                        </div>

                        {seasonData.episodes?.length == 0 && (
                            <p>No season data available</p>
                        )}
                        {seasonData.episodes?.length > 0 && (
                            <div className='season-wrapper'>
                                {seasonData.poster_path && (
                                    <img className='season-poster' src={`https://image.tmdb.org/t/p/w300${seasonData.poster_path}`} />
                                )}

                                <div className='season-info'>
                                    
                                    <div>
                                        {seasonData.name && (
                                            <h3 className='season-name'>{seasonData.name}</h3>
                                        )}
                                    
                                        {seasonData.air_date && (
                                            <p className="date">
                                                {new Date(seasonData.air_date) > new Date() ? (
                                                    <>Set to air on <span className="year">{new Date(seasonData.air_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                                                ) : (
                                                    <>Air date <span className="year">{new Date(seasonData.air_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                                                )}
                                            </p>
                                        )}
                                    
                                        {seasonData.vote_average > 0 && (
                                            <span className="info-item rating-avg">
                                                <StarIcon weight="fill"/>
                                                <span className="rating-num">
                                                    {Math.round(seasonData.vote_average * 10) / 10}
                                                </span>
                                            </span>
                                        )}
                                    </div>

                                    {seasonData.overview && (
                                        <p className='season-overview'>{seasonData.overview}</p>
                                    )}
                                
                                </div>
                            </div>
                        )}

                        <div className="heading">
                            <h2>Episodes</h2>
                        </div>
                        <div className="episode-list">
                            {seasonData?.episodes ? (
                                seasonData?.episodes?.map((episode, index) => (
                                    <div
                                        className={`episode ${
                                            selectedEpisodeSeason === selectedSeason && selectedEpisode === index + 1 ? 'selected' : ''
                                        } ${watchedSet.has(index + 1) ? 'watched' : ''}`}
                                        key={episode?.id}
                                        onClick={() => handleEpisodeClick(index + 1)}
                                        onContextMenu={(e) => { e.preventDefault(); toggleWatchedEpisode(selectedSeason, index + 1); }}
                                    >
                                        <span className="ep-num">{index + 1}</span>
                                        <div className="ep-thumbnail-container">
                                            <PlayCircle size={50} weight="fill" />
                                            {episode?.still_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w500${episode?.still_path}`}
                                                    alt={`Thumbnail`}
                                                />
                                            ) : (
                                                props.backdrop_path ? (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w500${props?.backdrop_path}`}
                                                        alt={`Thumbnail missing`}
                                                    />
                                                ) : (
                                                    <img
                                                        src={nullThumbail}
                                                        alt={`Thumbnail missing`}
                                                    />
                                                )
                                            )}
                                        </div>
                                        <div className="ep-text">
                                            <div className="top-text">
                                                <h3 className="ep-name">{episode?.name}</h3>
                                                {episode?.runtime && (
                                                    <h3 className="ep-runtime">{episode?.runtime}m</h3>
                                                )}
                                            </div>
                                            <p className="ep-overview">{episode?.overview}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Loading...</p>
                            )}
                            {seasonData?.episodes?.length === 0 && <p>No episodes available</p>}
                        </div>
                        {/* Media Component */}
                        {(props.videos?.results?.length > 0 || props.images?.backdrops?.length > 0 || props.images?.posters?.length > 0 || props.images?.logos?.length > 0) && (
                            <Media {...props} />
                        )}

                    </div>
                )}
            </div>
    );
}