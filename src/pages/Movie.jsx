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
              document.title = `${data?.title} ${ data?.release_date && '(' + data?.release_date.split('-')[0] + ')' } - Notflix`; // Set document title
              setMovieDetails(data) // Save `results` to state
            })
            .catch(err => console.error(err));
    }, [id]);
    
    return (
      <>
        <title>{`${movieDetails?.title} ${ movieDetails?.release_date && '(' + movieDetails?.release_date.split('-')[0] + ')' } - Notflix`}</title>
        <meta property="og:title" content={`${movieDetails?.title} ${ movieDetails?.release_date && '(' + movieDetails?.release_date.split('-')[0] + ')' }`} />
        <meta property="og:site_name" content="Notflix" />
        <meta name="description" content={movieDetails?.overview} />
        <meta property="og:description" content={movieDetails?.overview} />
        <meta property="og:image" content={`https://image.tmdb.org/t/p/w200${movieDetails?.poster_path}`} />
        <meta property="og:url" content={`https://creightoneli.github.io/notflix/#/movie/${id}`} />
        <meta property="og:type" content="website" />

        <Embed {...movieDetails} />
        <main>
            <Carousel headline='Related Movies' id={id} type='related_movies' mediaList={movieDetails?.recommendations?.results} />
            <Carousel headline='Similar Movies' id={id} type='similar_movies' mediaList={movieDetails?.similar?.results} />
        </main>
        <Cast {...movieDetails} />
      </>
    )
}