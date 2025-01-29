import './Home.css'
import Hero from '../components/Hero'
import Cards from '../components/Cards'
import React, { useEffect, useState } from 'react';

import { CaretRight } from "@phosphor-icons/react"

function Home() {
  const [movies, setMovies] = useState([]); // State to store movie data
  const [shows, setShows] = useState([]); // State to store show data

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
      }
    };

    fetch('https://api.themoviedb.org/3/trending/movie/day?append_to_response=credits&language=en-US', options)
      .then(response => response.json()) // Parse JSON response
      .then(data => setMovies(data.results)) // Save `results` to state
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
      }
    };

    fetch('https://api.themoviedb.org/3/trending/tv/day?language=en-US', options)
      .then(response => response.json()) // Parse JSON response
      .then(data => setShows(data.results)) // Save `results` to state
      .catch(err => console.error(err));
  }, []);

  // console.log(movies)

  const mergedObjects = [...movies, ...shows]

  // get random number to index hero banner image
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  return (
    <>
      <Hero {...mergedObjects[getRandomInt(40)]} />
      <main>
        <h3><a>Trending Movies<span>See all<CaretRight /></span></a></h3>
        <div className='gallery'>
          {movies.slice(0, 6).map((movie) => (
            <Cards key = {movie.id} {...movie} />
          ))}
        </div>
        <h3><a>Trending Shows<span>See all<CaretRight /></span></a></h3>
        <div className='gallery'>
          {shows.slice(0, 6).map((show) => (
            <Cards key = {show.id} {...show} />
          ))}
        </div>
      </main>
    </>
  )
}

export default Home
