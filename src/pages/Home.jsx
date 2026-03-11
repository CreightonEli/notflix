import Hero from '../components/Hero';
import Carousel from '../components/Carousel';
import React, { useEffect, useState } from 'react';
import useApiKey from '../hooks/useApiKey';
import logoSmallShadow from '../assets/logo_small_shadow.png';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [movieLists, setMovieLists] = useState([]);
  const [showLists, setShowLists] = useState([]);
  const [apiKey, setApiKey] = useApiKey();

  // recentlyWatched & watchlist pulled from localStorage
  const [recentlyWatched, setRecentlyWatched] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  // Fetch options
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  };

  // Fetch data only if the API key is set
  useEffect(() => {
    if (!apiKey) return; // Prevent fetch requests if the API key is not set

    fetch('https://api.themoviedb.org/3/trending/movie/day?append_to_response=credits&language=en-US', options)
      .then((response) => response.json())
      .then((data) => setMovies(data.results))
      .catch((err) => console.error(err));

    fetch('https://api.themoviedb.org/3/trending/tv/day?language=en-US', options)
      .then((response) => response.json())
      .then((data) => setShows(data.results))
      .catch((err) => console.error(err));

    fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
      .then((response) => response.json())
      .then((data) => setMovieLists(data.results))
      .catch((err) => console.error(err));

    fetch('https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1', options)
      .then((response) => response.json())
      .then((data) => setShowLists(data.results))
      .catch((err) => console.error(err));
  }, [apiKey]); // Only re-run this effect when the API key changes

  // load recent history & watchlist from localStorage and subscribe to updates
  useEffect(() => {
    const loadLists = () => {
      let hist = JSON.parse(localStorage.getItem('recentlyWatched') || '[]');
      if (!Array.isArray(hist)) hist = [];
      setRecentlyWatched(hist);
      let wl = JSON.parse(localStorage.getItem('watchlist') || '[]');
      if (!Array.isArray(wl)) wl = [];
      setWatchlist(wl);
    };

    loadLists();

    const historyHandler = () => loadLists();
    const watchHandler = () => loadLists();
    window.addEventListener('historyUpdated', historyHandler);
    window.addEventListener('watchlistUpdated', watchHandler);
    return () => {
      window.removeEventListener('historyUpdated', historyHandler);
      window.removeEventListener('watchlistUpdated', watchHandler);
    };
  }, []); // run once on mount

  const mergedObjects = [...movies, ...shows];

  // sort history so most recent items are first
  const sortedHistory = React.useMemo(() => {
    return [...recentlyWatched].sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
  }, [recentlyWatched]);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  return (
    <>
      <title>Home - Nullflix</title>
      <meta property="og:title" content="Home" />
      <meta property="og:site_name" content="Nullflix" />
      <meta name="description" content="Home page of Nullflix, showcasing trending movies and TV shows." />
      <meta property="og:description" content="Home page of Nullflix, showcasing trending movies and TV shows." />
      <meta property="og:image" content={`https://nullflix.vercel.app${logoSmallShadow}`} />
      <meta property="og:url" content="https://nullflix.vercel.app/" />
      <meta property="og:type" content="website" />

      <Hero {...mergedObjects[getRandomInt(40)]} />
      <main>
        <Carousel headline="Continue Watching" type="continue_watching" mediaList={sortedHistory} seeAllPath="/history" />
        <Carousel headline="My List" type="my_list" mediaList={watchlist} seeAllPath="/lists" />
        <Carousel headline="Trending Movies" type="trending" mediaList={movies} />
        <Carousel headline="Trending TV" type="trending" mediaList={shows} />
        <Carousel headline="Top Rated Movies" type="top_rated" mediaList={movieLists} />
        <Carousel headline="Top Rated TV" type="top_rated" mediaList={showLists} />
      </main>
    </>
  );
}