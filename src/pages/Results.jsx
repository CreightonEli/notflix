import './Home.css'
import Cards from '../components/Cards'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";

function Results() {

    // Use the hook to get search parameters
    const [searchParams] = useSearchParams();

    // Extract the 'search' query parameter
    const query = searchParams.get("search");

    // const [movies, setMovies] = useState([]); // State to store movie data
    const [media, setMedia] = useState([]); // State to store show data

    const multiFilter = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`
    const movieFilter = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    const showFilter = `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`

    let activeFilter = multiFilter

    useEffect(() => {
    const options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
        }
    };

    fetch(activeFilter, options)
        .then(response => response.json()) // Parse JSON response
        .then(data => setMedia(data.results)) // Save `results` to state
        .catch(err => console.error(err));
    }, [query, activeFilter]);

  return (
    <main>
      <h3>{query}</h3>
      <div className='gallery'>
        {media.map((media) => (
          <Cards key = {media.id} {...media} />
        ))}
      </div>
    </main>
  )
}

export default Results
