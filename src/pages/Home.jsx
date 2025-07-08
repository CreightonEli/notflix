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

  const mergedObjects = [...movies, ...shows];

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
        <Carousel headline="Trending Movies" type="trending" mediaList={movies} />
        <Carousel headline="Trending TV" type="trending" mediaList={shows} />
        <Carousel headline="Top Rated Movies" type="top_rated" mediaList={movieLists} />
        <Carousel headline="Top Rated TV" type="top_rated" mediaList={showLists} />
      </main>
    </>
  );
}