import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Details from '../components/Details'
import Cards from '../components/Cards'
import { CaretRight } from "@phosphor-icons/react"


function Show() {
    const { id } = useParams()
    const [showDetails, setShowDetails] = useState([]); // State to store media data

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
            }
        };

        fetch(`https://api.themoviedb.org/3/tv/${id}?append_to_response=recommendations&language=en-US`, options)
            .then(response => response.json()) // Parse JSON response
            .then(data => setShowDetails(data)) // Save `results` to state
            .catch(err => console.error(err));
    }, [id]);

               
    // console.log(showDetails.id)
    return (
      <>
        <Details {...showDetails} />
        <main>
            <h3><a>Related Shows<span>See all<CaretRight /></span></a></h3>
            <div className='gallery'>
              {showDetails?.recommendations?.results?.length > 0 && (
                showDetails.recommendations.results.slice(0, 12).map((show) => (
                  <Cards key = {show.id} {...show} />
                ))
              )}
            </div>
        </main>
      </>
    )
}

export default Show