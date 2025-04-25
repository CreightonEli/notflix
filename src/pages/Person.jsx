import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { User } from '@phosphor-icons/react';
import Cards from '../components/Cards'; // Import the Card component
import useApiKey from '../hooks/useApiKey';

export default function Person() {
    const { id } = useParams();
    const [person, setPerson] = useState([]); // State to store media data
    const [showFullBiography, setShowFullBiography] = useState(false); // State to toggle biography display
    const [apiKey, setApiKey] = useApiKey();

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${apiKey}` // Use environment variable for API key
            }
        };

        fetch(`https://api.themoviedb.org/3/person/${id}?append_to_response=combined_credits&language=en-US&include_image_language=en,null`, options)
            .then(response => response.json()) // Parse JSON response
            .then(data => {
              console.log(data);
              document.title = `${data?.name} - Notflix`; // Set document title
              setPerson(data); // Save `results` to state
            })
            .catch(err => console.error(err));
    }, [id]);
    
    return (
      <main className='person'>
        <div className='overview'>
          {person?.profile_path ? (
            <div className='img-wrapper'>
              <img src={`https://image.tmdb.org/t/p/w300${person?.profile_path}`} alt={"Profile image of " + person?.name} />
            </div>
          ): (
            <div className='img-wrapper'>
              <User size={64} />
            </div>
          )}
          <h2>Overview</h2>
          {person?.known_for_department && <><span>Known for</span><p>{person?.known_for_department}</p></>}
          <span>Gender</span>
          <p>
            {person.gender === 0 && ('Not specified')}
            {person.gender === 1 && ('Female')}
            {person.gender === 2 && ('Male')}
            {person.gender === 3 && ('Non-binary')}
          </p>
          {person?.birthday && (
            <>
              <span>Born</span>
              <p>{new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </>
          )}
          {person?.place_of_birth && (
            <>
              <span>Place of birth</span>
              <p>{person?.place_of_birth}</p>
            </>
          )}
          {person?.deathday && (
            <>
              <span>Died</span>
              <p>{new Date(person.deathday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </>
          )}
          <span>Links</span>
          
          {person?.homepage && <p><a href={person?.homepage} target='_blank'>Homepage</a></p>}
          {person?.imdb_id && <p><a href={`https://www.imdb.com/name/${person?.imdb_id}`} target='_blank'>IMDB</a></p>}
          <p><a href={`https://www.themoviedb.org/person/${person?.id}`} target='_blank'>TMDB</a></p>

          {person?.also_known_as?.length > 0 && <span>Also known as</span>}
          {person?.also_known_as?.length > 0 && person?.also_known_as.map((alias, index) => (
            <p key={index}>{alias}</p>
          ))}
        </div>
        
        <div className='biography'>
          <h2>{person?.name}</h2>
          {person?.biography && (
            <>
              <h3>Biography</h3>
              {showFullBiography ? (
                // Show full biography
                person.biography.match(/[^.!?]+[.!?]+/g)?.reduce((acc, sentence, index) => {
                  const chunkIndex = Math.floor(index / 3); // Group sentences into chunks of 3
                  if (!acc[chunkIndex]) acc[chunkIndex] = ''; // Initialize chunk
                  acc[chunkIndex] += sentence + ' '; // Add sentence to chunk
                  return acc;
                }, []).map((chunk, index) => (
                  <p key={index}>{chunk.trim()}</p>
                ))
              ) : (
                // Show trimmed biography (first 3 sentences)
                <p>
                  {person.biography.match(/[^.!?]+[.!?]+/g)?.slice(0, 3).join(' ') || person.biography}
                </p>
              )}
              {/* Conditionally render the button only if the biography has more than 3 sentences */}
              {person.biography.match(/[^.!?]+[.!?]+/g)?.length > 3 && (
                <button className='bio-btn' onClick={() => setShowFullBiography(!showFullBiography)}>
                  {showFullBiography ? 'Read Less' : 'Read More'}
                </button>
              )}
            </>
          )}

          {person?.combined_credits && (
            <>
              <h3>Filmography</h3>

              {Object.entries({
                ...person.combined_credits.crew.reduce((acc, media) => {
                  if (!acc[media.job]) acc[media.job] = []; // Initialize array for each job
                  acc[media.job].push(media); // Group by job
                  return acc;
                }, {}),
                ...(person.combined_credits.cast.length > 0 && { Actor: person.combined_credits.cast }), // Add the Actor section only if there are roles
              })
                .sort((a, b) => b[1].length - a[1].length) // Sort sections by the number of roles
                .map(([role, mediaList]) => (
                  <React.Fragment key={role}>
                    <h4>{role}</h4>
                    <div className='filmography'>
                      {mediaList
                        .sort((a, b) => new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date)) // Sort by recency
                        .map((media) => (
                          <Cards
                            key={media.id || `${role}-${Math.random()}`} // Fallback key if media.id is missing
                            {...media}
                          />
                        ))}
                    </div>
                  </React.Fragment>
                ))}
            </>
          )}
        </div>
      </main>
    );
}