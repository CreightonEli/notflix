import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import useApiKey from '../hooks/useApiKey';
import { ClockIcon, FilmStripIcon, StarIcon, CircleIcon, InfoIcon } from '@phosphor-icons/react';
import genres from '../genres';

export default function Collection() {
    // get collection id from the URL
    const { id } = useParams()
    const [collectionDetails, setCollectionDetails] = useState([]); // State to store media data
    const [apiKey, setApiKey] = useApiKey();
    const [sortOption, setSortOption] = useState('least-recent'); // Default: least recent

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}` // Use environment variable for API key
            }
        };

        fetch(`https://api.themoviedb.org/3/collection/${id}?language=en-US`, options)
            .then(res => res.json())
            .then(res => setCollectionDetails(res))
            .catch(err => console.error(err));
    }, [id]);

    // Function to get genre names from IDs
    const getGenreNames = (ids) => {
        if (!ids) return [];
        return ids.map((id) => {
            const genre = genres.find((g) => g.id === id); // Match ID with genre
            return genre ? genre.name : "Unknown";
        });
    };

    // Sorting function for parts
    const sortParts = (parts) => {
        if (!parts) return [];
        // Separate known and unknown year parts
        const known = parts.filter(p => p.release_date);
        const unknown = parts.filter(p => !p.release_date);

        let sortedKnown = [...known];
        switch (sortOption) {
            case 'most-recent':
                sortedKnown.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
                break;
            case 'least-recent':
                sortedKnown.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
                break;
            default:
                break;
        }
        return [...sortedKnown, ...unknown];
    };

    // Get sorted parts for grouping
    const sortedParts = sortParts(collectionDetails.parts);

    // Group sorted parts by year (unknown at the end)
    const groupedByYear = sortedParts?.reduce((acc, part) => {
        const dateStr = part.release_date;
        if (!dateStr) {
            if (!acc['unknown']) acc['unknown'] = [];
            acc['unknown'].push(part);
            return acc;
        }
        const year = new Date(dateStr).getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(part);
        return acc;
    }, {}) || {};

    // Sort years in ascending order for least-recent, descending for most-recent, else by year ascending
    let years = Object.keys(groupedByYear)
        .filter(year => year !== 'unknown')
        .map(Number);

    if (sortOption === 'most-recent') {
        years.sort((a, b) => b - a);
    } else {
        years.sort((a, b) => a - b);
    }

    console.log(collectionDetails)

    return (
        <div className="collection-page">
            <div className="collection-backdrop" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${collectionDetails.backdrop_path})` }}>
                <div className="collection-top">

                    <img className="collection-hero" src={`https://image.tmdb.org/t/p/w500${collectionDetails.poster_path}`} alt={collectionDetails.name} />
                    
                    <div className="collection-info">
                        <h1>{collectionDetails.name}</h1>

                        <p>{collectionDetails.overview}</p>

                        <div className="collection-stats">
                            <div className="info-item">
                                <h2>Avg. Rating</h2>
                                <span className="stat-num">
                                    <StarIcon weight="fill"/>
                                    {collectionDetails.parts && collectionDetails.parts.length > 0 ? (
                                        (() => {
                                            const ratedParts = collectionDetails.parts.filter(part => part.vote_average > 0);
                                            return ratedParts.length > 0
                                                ? Math.round((ratedParts.reduce((sum, part) => sum + part.vote_average, 0) / ratedParts.length) * 10) / 10
                                                : 'N/A';
                                        })()
                                    ) : 'N/A'}
                                </span>
                            </div>
                            <div className="info-item">
                                <h2>Years 
                                    <span className='age'>
                                        {collectionDetails.parts && collectionDetails.parts.length > 0 ? (` ${new Date().getFullYear() - new Date(collectionDetails.parts[0].release_date).getFullYear()}`) : ''}
                                    </span>
                                </h2>
                                <span className="stat-num">
                                    <ClockIcon weight="fill"/>
                                    {collectionDetails.parts && collectionDetails.parts.length > 0 ? (() => {
                                    const parts = collectionDetails.parts;
                                    const firstDate = parts[0]?.release_date || "";
                                    const lastIndex = parts.length - 1;

                                    // choose last part; if its release_date is empty, fall back to previous item(s)
                                    let lastDate = parts[lastIndex]?.release_date || "";
                                    if (!lastDate && lastIndex > 0) {
                                        // scan backwards until you find a non-empty release_date or reach index 0
                                        for (let i = lastIndex - 1; i >= 0; i--) {
                                        if (parts[i]?.release_date) { lastDate = parts[i].release_date; break; }
                                        }
                                    }

                                    const safeYear = d => {
                                        if (!d) return "unknown";
                                        const parsed = new Date(d);
                                        return isNaN(parsed) ? "unknown" : parsed.getFullYear();
                                    };

                                    return `${safeYear(firstDate)} / ${safeYear(lastDate)}`;
                                    })() : 'N/A'}
                                </span>
                            </div>
                            <div className="info-item">
                                <h2>Total Films</h2>
                                <span className="stat-num">
                                    <FilmStripIcon weight="fill"/>
                                    {collectionDetails.parts ? collectionDetails.parts.length : 'N/A'}
                                </span>
                            </div>
                        </div>
                        {/* display genres using our genres.js and the usual markup */}
                        <div className="collection-genres">
                            {collectionDetails.parts && collectionDetails.parts.length > 0 && (
                                Array.from(new Set(collectionDetails.parts.flatMap(part => part.genre_ids))).map(genreId => {
                                    const genreName = genres.find(g => g.id === genreId)?.name;
                                    return (
                                        <span key={genreId} className="tag">
                                            {genreName}
                                        </span>
                                    );
                                })
                            )}
                        </div>
                    </div>

                </div>
            </div>
            <div className="collection-parts">
                <div className="sort-dropdown">
                    <select
                        id="sort-parts"
                        value={sortOption}
                        onChange={e => setSortOption(e.target.value)}
                    >
                        <option value="least-recent">Oldest First</option>
                        <option value="most-recent">Newest First</option>
                    </select>
                </div>
                <div className="collection-parts-list">
                    <>
                        {years.map(year => (
                            <React.Fragment key={year}>
                                <div className='year-header'>
                                    <CircleIcon size={32} weight="regular" />
                                    <h4>{year}</h4>
                                </div>
                                <div className="year-group">
                                    {groupedByYear[year].map(part => (
                                        <div key={part.id} className="part">
                                            <div className='part-banner' style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w780${part.backdrop_path})` }} ></div>
                                            <div className="part-section title-section">
                                                { part.poster_path !== null ? (
                                                    <img className='part-poster' src={`https://image.tmdb.org/t/p/w500${part.poster_path}`} alt={part.title} />
                                                ) : (
                                                    <img className='part-poster' src={`https://image.tmdb.org/t/p/w500${collectionDetails.poster_path}`} alt='No poster found' />
                                                )}
                                                <div className='part-info'>
                                                    <h3>{part.title}</h3>
                                                    <p className="date">
                                                        {new Date(part.release_date) > new Date() ? (
                                                            <>Set to release on <span className="year">{new Date(part.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                                                        ) : (
                                                            <>Released <span className="year">{new Date(part.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                                                        )}
                                                    </p>
                                                    {part.vote_average > 0 && (
                                                        <span className="info-item rating-avg">
                                                            <StarIcon weight="fill"/>
                                                            <span className="rating-num">
                                                                {Math.round(part.vote_average * 10) / 10}
                                                            </span>
                                                        </span>
                                                    )}
                                                    <p className="genre-container">
                                                        {getGenreNames(part.genre_ids).map((genre, index) => (
                                                            <span key={index} className="tag">
                                                                {genre}
                                                            </span>)
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='part-section overview-section'>
                                                <p>{part.overview}</p>
                                            </div>
                                            <div className='part-section link-section'>
                                                <Link to={`/movies/${part.id}`}>
                                                    <button className="view-btn">
                                                        <InfoIcon weight="bold" />
                                                        More Info
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </React.Fragment>
                        ))}
                        {groupedByYear['unknown'] && groupedByYear['unknown'].length > 0 && (
                            <React.Fragment key="unknown">
                                <div className='year-header'>
                                    <CircleIcon size={32} />
                                    <h4>Date Unknown</h4>
                                </div>
                                <div className="year-group">
                                    {groupedByYear['unknown'].map(part => (
                                        <div key={part.id} className="part">
                                            <div className='part-banner' style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w780${part.backdrop_path})` }} ></div>
                                            <div className="part-section title-section">
                                                { part.poster_path !== null ? (
                                                    <img className='part-poster' src={`https://image.tmdb.org/t/p/w500${part.poster_path}`} alt={part.title} />
                                                ) : (
                                                    <img className='part-poster' src={`https://image.tmdb.org/t/p/w500${collectionDetails.poster_path}`} alt='No poster found' />
                                                )}
                                                <div className='part-info'>
                                                    <h3>{part.title}</h3>
                                                    <p className="date">
                                                        {part.release_date ? (
                                                            new Date(part.release_date) > new Date() ? (
                                                                <>Set to release on <span className="year">{new Date(part.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                                                            ) : (
                                                                <>Released <span className="year">{new Date(part.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></>
                                                            )
                                                        ) : (
                                                            <>Release date unknown</>
                                                        )}
                                                    </p>
                                                    
                                                    { part.vote_average < 0 &&
                                                        <span className="info-item rating-avg">
                                                            <StarIcon weight="fill"/>
                                                            <span className="rating-num">
                                                                {Math.round(part.vote_average * 10) / 10}
                                                            </span>
                                                        </span> 
                                                    }

                                                    <p className="genre-container">
                                                        {getGenreNames(part.genre_ids).map((genre, index) => (
                                                            <span key={index} className="tag">
                                                                {genre}
                                                            </span>)
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='part-section overview-section'>
                                                <p>{part.overview}</p>
                                            </div>
                                            <div className='part-section link-section'>
                                                <Link to={`/movies/${part.id}`}>
                                                    <button className="view-btn">
                                                        <InfoIcon weight="bold" />
                                                        More Info
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </React.Fragment>
                        )}
                    </>
                </div>
            </div>
        </div>
    );
}