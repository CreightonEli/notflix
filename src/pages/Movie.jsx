import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Details from '../components/Details'
import Cards from '../components/Cards'
import { CaretRight } from "@phosphor-icons/react"


function Movie() {
    const { id } = useParams()
    const [movieDetails, setMovieDetails] = useState([]); // State to store media data

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
            }
        };

        fetch(`https://api.themoviedb.org/3/movie/${id}?append_to_response=recommendations,credits&language=en-US`, options)
            .then(response => response.json()) // Parse JSON response
            .then(data => setMovieDetails(data)) // Save `results` to state
            .catch(err => console.error(err));
    }, [id]);

    console.log(movieDetails)
    
    return (
      <>
        <Details {...movieDetails} />
        <main>
            <h3><a>Related Movies<span>See all<CaretRight /></span></a></h3>
            <div className='gallery'>
              {movieDetails?.recommendations?.results?.length > 0 && (
                movieDetails.recommendations.results.slice(0, 12).map((movie) => (
                  <Cards key = {movie.id} {...movie} />
                ))
              )}
            </div>
        </main>
      </>
    )
}

export default Movie