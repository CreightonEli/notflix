import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Embed from '../components/Embed'
import Cast from '../components/Cast';
import Carousel from '../components/Carousel';
import useApiKey from '../hooks/useApiKey';


export default function Show() {
    const { id } = useParams()
    const [showDetails, setShowDetails] = useState([]); // State to store media data
    const [apiKey, setApiKey] = useApiKey();

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}` // Use environment variable for API key
            }
        };

        fetch(`https://api.themoviedb.org/3/tv/${id}?append_to_response=recommendations,aggregate_credits,images,videos,similar&language=en-US&include_image_language=en,null`, options)
            .then(response => response.json()) // Parse JSON response
            .then(data => {
                setShowDetails(data) // Save `results` to state
            })
            .catch(err => console.error(err));
    }, [id]);

               
    // console.log(showDetails)
    return (
        <>
            <title>{`${showDetails?.name} ${ showDetails?.first_air_date && '(' + showDetails?.first_air_date.split('-')[0] + ')' } - Notflix`}</title>
            <meta property="og:title" content={`${showDetails?.name} ${ showDetails?.first_air_date && '(' + showDetails?.first_air_date.split('-')[0] + ')' }`} />
            <meta property="og:site_name" content="Notflix" />
            <meta name="description" content={showDetails?.overview} />
            <meta property="og:description" content={showDetails?.overview} />
            <meta property="og:image" content={`https://image.tmdb.org/t/p/w200${showDetails?.poster_path}`} />
            <meta property="og:url" content={`https://creightoneli.github.io/notflix/#/shows/${id}`} />
            <meta property="og:type" content="website" />

            <Embed {...showDetails} />
            <main>
                <Carousel headline='Related Shows' id={id} type='related_shows' mediaList={showDetails?.recommendations?.results} />
                <Carousel headline='Similar Shows' id={id} type='similar_shows' mediaList={showDetails?.similar?.results} />
            </main>
            <Cast {...showDetails} />
        </>
    )
}