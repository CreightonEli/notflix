import Details from '../components/Details'
import React, { useEffect, useState } from 'react';
import { PlayCircle, CornersOut, CornersIn } from "@phosphor-icons/react";
import { useHeaderVisibility } from '../context/HeaderVisibilityContext';
import useApiKey from '../hooks/useApiKey';

export default function Embed(props) {
    const { isHeaderVisible, setIsHeaderVisible } = useHeaderVisibility();
    const [seasonData, setSeasonData] = useState([]); // State to store episode data
    const [selectedSeason, setSelectedSeason] = useState(1); // State to store selected season
    const [selectedEpisode, setSelectedEpisode] = useState(1); // State to store selected episode
    const [selectedSource, setSelectedSource] = useState(''); // State to store selected source
    const [isTheaterMode, setIsTheaterMode] = useState(false); // State for theater mode
    const [apiKey, setApiKey] = useApiKey();

    // provider URLs
    const vidLinkMovieURL = `https://vidlink.pro/movie/${props.id}&?autoplay=false`;
    const vidLinkShowURL = `https://vidlink.pro/tv/${props.id}/${selectedSeason}/${selectedEpisode}&?autoplay=false`;
    const embedMovieURL = `https://embed.su/embed/movie/${props.id}`;
    const embedShowURL = `https://embed.su/embed/tv/${props.id}/${selectedSeason}/${selectedEpisode}`;
    const vidsrcMovieURL = `https://vidsrc.cc/v3/embed/movie/${props.id}`;
    const vidsrcShowURL = `https://vidsrc.cc/v3/embed/tv/${props.id}/${selectedSeason}/${selectedEpisode}`;
    const vidsrcAnimeSubURL = `https://vidsrc.cc/v2/embed/anime/tmdb${props.id}/${selectedEpisode}/sub?autoPlay=false`;
    const vidsrcAnimeDubURL = `https://vidsrc.cc/v2/embed/anime/tmdb${props.id}/${selectedEpisode}/dub?autoPlay=false`;
    const vidsrcMovie2URL = `https://vidsrc.me/embed/movie?tmdb=${props.id}`;
    const vidsrcShow2URL = `https://vidsrc.me/embed/tv?tmdb=${props.id}&season=${selectedSeason}&episode=${selectedEpisode}`;

    let defaultURL = 'https://embed.su/embed/movie/${props.id}';
    props.title && (defaultURL = vidLinkMovieURL);
    props.name && (defaultURL = vidLinkShowURL);

    useEffect(() => {
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

    useEffect(() => {
        setSelectedSource(defaultURL);
        setSelectedSeason(1);
        setSelectedEpisode(1);
    }, [props.id]);

    const constructSourceUrl = (baseUrl, season, episode) => {
        if (baseUrl.includes('embed.su')) {
            return baseUrl.replace(/\/\d+\/\d+$/, `/${season}/${episode}`);
        } else if (baseUrl.includes('vidsrc.cc')) {
            if (baseUrl.includes('anime')) {
                return baseUrl.replace(/\/\d+\/(sub|dub)\?/, `/${episode}/$1?`);
            } else {
                return baseUrl.replace(/\/\d+\/\d+$/, `/${season}/${episode}`);
            }
        } else if (baseUrl.includes('vidsrc.me')) {
            // Handle vidsrcShow2URL with query parameters
            const url = new URL(baseUrl);
            url.searchParams.set('season', season);
            url.searchParams.set('episode', episode);
            return url.toString();
        }
        return baseUrl;
    };

    const updateSource = (source) => {
        const newSource = constructSourceUrl(source, selectedSeason, selectedEpisode);
        setSelectedSource(newSource);
    };

    const handleSourceChange = (event) => {
        updateSource(event.target.value);
    };

    const handleSeasonChange = (event) => {
        const newSeason = Number(event.target.value);
        setSelectedSeason(newSeason);
        setSelectedEpisode(1); // Reset to the first episode when season changes
        const newSource = constructSourceUrl(selectedSource, newSeason, 1);
        setSelectedSource(newSource);
    };

    const handleEpisodeClick = (episodeNumber) => {
        setSelectedEpisode(episodeNumber);
        const newSource = constructSourceUrl(selectedSource, selectedSeason, episodeNumber);
        setSelectedSource(newSource);
    };

    const toggleTheaterMode = () => {
        setIsTheaterMode(!isTheaterMode);
        setIsHeaderVisible(isTheaterMode); // Hide header when entering theater mode
    };

    return (
        <div>
            <div
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
                            <iframe src={selectedSource} frameBorder="0" allowFullScreen></iframe>
                        </div>
                    </div>
                </section>

                {props.title && (
                    <div className="source-container">
                        <div className="source-control">
                            <select name="source" id="source" onChange={handleSourceChange}>
                                <option value={vidLinkMovieURL}>VidLink</option>
                                <option value={vidsrcMovieURL}>VidSrc</option>
                                <option value={embedMovieURL}>Embed.su</option>
                                <option value={vidsrcMovie2URL}>VidSrc 2</option>
                            </select>
                            <button
                                className={`theater-mode ${isTheaterMode ? 'active' : ''}`}
                                onClick={toggleTheaterMode}
                            >
                                {isTheaterMode ? (
                                    <>
                                        <span>Exit Theater Mode</span>
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
                    </div>
                )}
            </div>
            {props.name && (
                <div className="episode-selector">
                    <div className="source-control">
                        <select name="source" id="source" onChange={handleSourceChange}>
                            <option value={vidLinkShowURL}>VidLink</option>
                            <option value={vidsrcShowURL}>VidSrc</option>
                            <option value={embedShowURL}>Embed.su</option>
                            <option value={vidsrcShow2URL}>VidSrc 2</option>
                            <option value={vidsrcAnimeSubURL}>VS Anime (Sub)</option>
                            <option value={vidsrcAnimeDubURL}>VS Anime (Dub)</option>
                        </select>
                        <button
                            className={`theater-mode ${isTheaterMode ? 'active' : ''}`}
                            onClick={toggleTheaterMode}
                        >
                            {isTheaterMode ? (
                                <>
                                    <span>Exit Theater Mode</span>
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
                    <div className="heading">
                        <h2>Episodes</h2>
                        <select name="seasons" id="seasons" onChange={handleSeasonChange}>
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
                    <div className="episode-list">
                        {seasonData?.episodes ? (
                            seasonData?.episodes?.map((episode, index) => (
                                <div
                                    className={`episode ${
                                        selectedEpisode === index + 1 ? 'selected' : ''
                                    }`}
                                    key={episode?.id}
                                    onClick={() => handleEpisodeClick(index + 1)}
                                >
                                    <span className="ep-num">{index + 1}</span>
                                    <div className="ep-thumbnail-container">
                                        <PlayCircle size={50} weight="fill" />
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${episode?.still_path}`}
                                            alt={`Thumbnail for ${episode?.name} not found`}
                                        />
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
                </div>
            )}
        </div>
    );
}