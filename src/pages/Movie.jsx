import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Embed from '../components/Embed'
import Cast from '../components/Cast'
import Carousel from '../components/Carousel';
import useApiKey from '../hooks/useApiKey';


export default function Movie() {
    const { id } = useParams()
    const [movieDetails, setMovieDetails] = useState([]); // State to store media data
    const [apiKey, setApiKey] = useApiKey();

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${apiKey}` // Use environment variable for API key
            }
        };

        fetch(`https://api.themoviedb.org/3/movie/${id}?append_to_response=recommendations,credits,images,videos,similar&language=en-US&include_image_language=en,null`, options)
            .then(response => response.json()) // Parse JSON response
            .then(data => {
              document.title = `${data?.title} (${data?.release_date.split('-')[0]}) - Notflix`; // Set document title
              setMovieDetails(data) // Save `results` to state
            })
            .catch(err => console.error(err));
    }, [id]);
    
    return (
      <>
        <Embed {...movieDetails} />
        <main>
            <Carousel headline='Related Movies' id={id} type='related_movies' mediaList={movieDetails?.recommendations?.results} />
            <Carousel headline='Similar Movies' id={id} type='similar_movies' mediaList={movieDetails?.similar?.results} />
        </main>
        <Cast {...movieDetails} />
      </>
    )
}