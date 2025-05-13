import Cards from '../components/Cards'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import genres from '../genres'; // Import genres array
import useApiKey from '../hooks/useApiKey';
import logoSmall from '../assets/logo_small.png'; // Use relative path

export default function Results() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("search");
    const id = searchParams.get("id");
    const type = searchParams.get("type") || "trending";

    const [media, setMedia] = useState([]);
    const [filteredMedia, setFilteredMedia] = useState([]); // State for filtered media
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [activeFilter, setActiveFilter] = useState(null); // State for active filter (null, "movies", "shows")
    const [selectedGenres, setSelectedGenres] = useState([]); // State for selected genres
    const [apiKey, setApiKey] = useApiKey();

    const ITEMS_PER_PAGE = 20; // Define how many items to display per page

    const movieFilter = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`;
    const showFilter = `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=${page}`;
    const trendingMovieFilter = `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`;
    const trendingShowFilter = `https://api.themoviedb.org/3/trending/tv/day?language=en-US&page=${page}`;
    const topRatedMovieFilter = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`;
    const topRatedShowFilter = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${page}`;
    const relatedMoviesFilter = `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=${page}`;
    const relatedShowsFilter = `https://api.themoviedb.org/3/tv/${id}/recommendations?language=en-US&page=${page}`;
    const similarMoviesFilter = `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=${page}`;
    const similarShowsFilter = `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=${page}`;

    useEffect(() => {
        setPage(1);
    }, [query, type]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
        };

        let fetchMovies = Promise.resolve({ results: [], total_pages: 0, total_results: 0 });
        let fetchShows = Promise.resolve({ results: [], total_pages: 0, total_results: 0 });

        if (query) {
            document.title = `Results for "${query}" - Notflix`;
            fetchMovies = fetch(movieFilter, options).then(response => response.json());
            fetchShows = fetch(showFilter, options).then(response => response.json());
        } else {
            if (type === "trending") {
                document.title = `Trending - Notflix`;
                fetchMovies = fetch(trendingMovieFilter, options).then(response => response.json());
                fetchShows = fetch(trendingShowFilter, options).then(response => response.json());
            } else if (type === "top_rated") {
                document.title = `Top Rated - Notflix`;
                fetchMovies = fetch(topRatedMovieFilter, options).then(response => response.json());
                fetchShows = fetch(topRatedShowFilter, options).then(response => response.json());
            } else if (type === "related_movies") {
                document.title = `Related Movies - Notflix`;
                fetchMovies = fetch(relatedMoviesFilter, options).then(response => response.json());
            } else if (type === "related_shows") {
                document.title = `Related Shows - Notflix`;
                fetchShows = fetch(relatedShowsFilter, options).then(response => response.json());
            } else if (type === "similar_movies") {
                document.title = `Similar Movies - Notflix`;
                fetchMovies = fetch(similarMoviesFilter, options).then(response => response.json());
            } else if (type === "similar_shows") {
                document.title = `Similar Shows - Notflix`;
                fetchShows = fetch(similarShowsFilter, options).then(response => response.json());
            } else {
                document.title = `Trending - Notflix`;
                fetchMovies = fetch(trendingMovieFilter, options).then(response => response.json());
                fetchShows = fetch(trendingShowFilter, options).then(response => response.json());
            }
        }

        Promise.all([fetchMovies, fetchShows])
            .then(([movieData, showData]) => {
                const combinedResults = [...movieData.results, ...showData.results];
                combinedResults.sort((a, b) => b.popularity - a.popularity);

                if (page === 1) {
                    setMedia(combinedResults);
                } else {
                    setMedia(prevMedia => [...prevMedia, ...combinedResults]);
                }

                setTotalPages(movieData.total_pages + showData.total_pages / 2);
                setTotalResults(movieData.total_results + showData.total_results);
            })
            .catch(err => console.error(err));
    }, [query, type, page]);

    useEffect(() => {
        // Deduplicate media before filtering
        const deduplicatedMedia = Array.from(new Map(media.map(item => [item.id, item])).values());

        // Filter media based on the active filter and selected genres
        let filtered = deduplicatedMedia;

        if (activeFilter === "movies") {
            filtered = filtered.filter(item => item.media_type === "movie" || item.title);
        } else if (activeFilter === "shows") {
            filtered = filtered.filter(item => item.media_type === "tv" || item.name);
        }

        if (selectedGenres.length > 0) {
            filtered = filtered.filter(item =>
                item.genre_ids && // Ensure genre_ids exists
                selectedGenres.every(genreId => item.genre_ids.includes(genreId)) // Check if all selected genres are included
            );
        }

        setFilteredMedia(filtered);
    }, [media, activeFilter, selectedGenres]);

    useEffect(() => { // Attach scroll event listener to handle infinite scrolling
        if (media.length === 0 || page >= totalPages) return; // No media or already on the last page
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 100 // Adjust threshold as needed
            ) {
                if (media.length > 0 && page < totalPages) {
                    handleLoadMore();
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [media, page, totalPages]); // Dependencies to reattach the listener when these change

    const handleFilterClick = (filter) => {
        setActiveFilter(prevFilter => (prevFilter === filter ? null : filter));
    };

    const handleGenreClick = (genreId) => {
        setSelectedGenres(prevGenres =>
            prevGenres.includes(genreId)
                ? prevGenres.filter(id => id !== genreId) // Remove genre if already selected
                : [...prevGenres, genreId] // Add genre if not selected
        );
    };

    const handleLoadMore = () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
        };

        let fetchMovies = Promise.resolve({ results: [] });
        let fetchShows = Promise.resolve({ results: [] });

        if (query) {
            fetchMovies = fetch(
                `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page + 1}`,
                options
            ).then(response => response.json());

            fetchShows = fetch(
                `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=${page + 1}`,
                options
            ).then(response => response.json());
        } else {
            if (type === "trending") {
                fetchMovies = fetch(
                    `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page + 1}`,
                    options
                ).then(response => response.json());

                fetchShows = fetch(
                    `https://api.themoviedb.org/3/trending/tv/day?language=en-US&page=${page + 1}`,
                    options
                ).then(response => response.json());
            } else if (type === "top_rated") {
                fetchMovies = fetch(
                    `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page + 1}`,
                    options
                ).then(response => response.json());

                fetchShows = fetch(
                    `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${page + 1}`,
                    options
                ).then(response => response.json());
            }
        }

        Promise.all([fetchMovies, fetchShows])
            .then(([movieData, showData]) => {
                const combinedResults = [...movieData.results, ...showData.results];
                combinedResults.sort((a, b) => b.popularity - a.popularity);

                // Deduplicate media by ID before updating state
                setMedia(prevMedia => {
                    const allMedia = [...prevMedia, ...combinedResults];
                    const uniqueMedia = Array.from(new Map(allMedia.map(item => [item.id, item])).values());
                    return uniqueMedia;
                });

                setPage(prevPage => prevPage + 1); // Increment the page number
            })
            .catch(err => console.error(err));
    };

    console.log(media)
    return (
        <>
            <main className='results-page'>
                <div className='results-top'>
                    <h3>{(
                        query ? `Search results for "${query}"` :
                        type === "trending" ? "Trending" :
                        type === "top_rated" ? "Top Rated" :
                        type === "related_movies" ? "Related Movies" :
                        type === "related_shows" ? "Related Shows" :
                        type === "similar_movies" ? "Similar Movies" :
                        type === "similar_shows" ? "Similar Shows" :
                        "Results"
                    )}</h3>
                    <p>Results: {filteredMedia.length}</p>  
                </div>
                <div className='results-filters'>
                    <div className='media-type-filters'>
                        <button
                            className={`filter-btn media-type ${activeFilter === "movies" ? "active" : ""}`}
                            onClick={() => handleFilterClick("movies")}
                        >
                            Movies
                        </button>
                        <button
                            className={`filter-btn media-type ${activeFilter === "shows" ? "active" : ""}`}
                            onClick={() => handleFilterClick("shows")}
                        >
                            TV Shows
                        </button>
                    </div>
                    <div className='genre-filters'>
                        {genres.map(genre => (
                            <button
                                key={genre.id}
                                className={`filter-btn genre ${selectedGenres.includes(genre.id) ? "active" : ""}`}
                                onClick={() => handleGenreClick(genre.id)}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className='results-container'>
                    {filteredMedia
                        .slice(0, page * ITEMS_PER_PAGE) // Display only the items for the current page
                        .map((media) => (
                            <Cards
                                key={media.id}
                                {...media}
                            />
                        ))}
                </div>
                {page < totalPages && (
                    <div className='load-more'>
                        <img className="logo" src={logoSmall} alt="Notflix Logo" />
                        <img className="logo-shadow" src={logoSmall} alt="Notflix Logo" />
                    </div>
                )}
            </main>
        </>
    );
}
