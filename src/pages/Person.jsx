import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Circle } from '@phosphor-icons/react';
import Cards from '../components/Cards'; // Import the Card component
import useApiKey from '../hooks/useApiKey';
import nullPosterBig from '../assets/nullPosterBig.png'; // Use relative path

export default function Person() {
    const { id } = useParams();
    const [person, setPerson] = useState([]); // State to store media data
    const [showFullBiography, setShowFullBiography] = useState(false); // State to toggle biography display
    const [selectedRole, setSelectedRole] = useState(''); // State for selected role
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
              setPerson(data); // Save `results` to state
            })
            .catch(err => console.error(err));
    }, [id]);
    
    // Get unique roles from crew jobs and add "Actor" if cast exists, and count credits per role
    const { uniqueRoles, roleCounts } = React.useMemo(() => {
      if (!person?.combined_credits) return { uniqueRoles: [], roleCounts: {} };
      const crewJobs = person.combined_credits.crew.map(media => media.job);
      const rolesSet = new Set(crewJobs);
      const roleCounts = {};

      // Count crew jobs
      person.combined_credits.crew.forEach(media => {
        roleCounts[media.job] = (roleCounts[media.job] || 0) + 1;
      });

      // Add Actor if cast exists
      if (person.combined_credits.cast.length > 0) {
        rolesSet.add('Actor');
        roleCounts['Actor'] = person.combined_credits.cast.length;
      }

      return {
        uniqueRoles: Array.from(rolesSet).sort(),
        roleCounts
      };
    }, [person]);

    // Deduplicated role counts (number of unique media per role)
    const dedupedRoleCounts = React.useMemo(() => {
      if (!person?.combined_credits) return {};
      const counts = {};
      // Crew roles
      person.combined_credits.crew.forEach(media => {
        if (!counts[media.job]) counts[media.job] = new Set();
        counts[media.job].add(media.id);
      });
      // Actor role
      if (person.combined_credits.cast.length > 0) {
        counts['Actor'] = new Set();
        person.combined_credits.cast.forEach(media => {
          counts['Actor'].add(media.id);
        });
      }
      // Convert sets to counts
      Object.keys(counts).forEach(role => {
        counts[role] = counts[role].size;
      });
      return counts;
    }, [person]);

    // Set default selected role when roles are loaded
    useEffect(() => {
      if (uniqueRoles.length > 0 && !selectedRole) {
        setSelectedRole(uniqueRoles[0]);
      }
    }, [uniqueRoles, selectedRole]);
    
    // Set default selected role to the one with the most credits (alphabetically if tie)
    useEffect(() => {
      if (uniqueRoles.length > 0 && !selectedRole) {
        // Find the role(s) with the most credits
        const maxCount = Math.max(...uniqueRoles.map(role => roleCounts[role] || 0));
        const topRoles = uniqueRoles.filter(role => (roleCounts[role] || 0) === maxCount);
        // Pick alphabetically first if tie
        const defaultRole = topRoles.sort()[0];
        setSelectedRole(defaultRole);
      }
    }, [uniqueRoles, roleCounts, selectedRole]);
    
    return (
      <>
      <title>{`${person?.name} - Nullflix`}</title>
      <meta property="og:title" content={`${person?.name} - Nullflix`} />
      <meta property="og:site_name" content="Nullflix" />
      <meta name="description" content={person?.biography} />
      <meta property="og:description" content={person?.biography} />
      <meta property="og:image" content={`https://image.tmdb.org/t/p/w200${person?.profile_path}`} />
      <meta property="og:url" content={`https://nullflix.vercel.app/#/person/${id}`} />
      <meta property="og:type" content="website" />

      <main className='person'>
        <div className='overview'>
          {person?.profile_path ? (
            <div className='img-wrapper'>
              <img src={`https://image.tmdb.org/t/p/w300${person?.profile_path}`} alt={"Profile image of " + person?.name} />
            </div>
          ): (
            <div className='img-wrapper'>
              <img src={nullPosterBig} alt={"No profile image available for " + person?.name} />
            </div>
          )}
          <h1>{person?.name}</h1>
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
              {/* Add select for roles */}
              {uniqueRoles.length > 0 && (
                <div className='filmography-filter'>
                  <select
                    id="role-select"
                    name="role"
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                  >
                    {uniqueRoles.map(role => (
                      <option key={role} value={role}>
                        {role} ({dedupedRoleCounts[role] || 0})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {Object.entries({
                ...person.combined_credits.crew.reduce((acc, media) => {
                  if (!acc[media.job]) acc[media.job] = []; // Initialize array for each job
                  acc[media.job].push(media); // Group by job
                  return acc;
                }, {}),
                ...(person.combined_credits.cast.length > 0 && { Actor: person.combined_credits.cast }), // Add the Actor section only if there are roles
              })
                .filter(([role]) => role === selectedRole) // Only show selected role
                .sort((a, b) => b[1].length - a[1].length) // Sort sections by the number of roles
                .map(([role, mediaList]) => {
                  // Deduplicate mediaList by media.id
                  const uniqueMediaMap = new Map();
                  mediaList.forEach(media => {
                    if (!uniqueMediaMap.has(media.id)) {
                      uniqueMediaMap.set(media.id, media);
                    }
                  });
                  const uniqueMediaList = Array.from(uniqueMediaMap.values());

                  // Sort by date descending
                  const sorted = uniqueMediaList.sort(
                    (a, b) =>
                      new Date(b.release_date || b.first_air_date || '0000') -
                      new Date(a.release_date || a.first_air_date || '0000')
                  );

                  // Group by year, and collect items with no date
                  const groupedByYear = sorted.reduce((acc, media) => {
                    const dateStr = media.release_date || media.first_air_date;
                    if (!dateStr) {
                      if (!acc['unknown']) acc['unknown'] = [];
                      acc['unknown'].push(media);
                      return acc;
                    }
                    const year = new Date(dateStr).getFullYear();
                    if (!acc[year]) acc[year] = [];
                    acc[year].push(media);
                    return acc;
                  }, {});

                  // Only include years with at least one media item, sorted descending
                  const years = Object.keys(groupedByYear)
                    .filter(year => year !== 'unknown')
                    .sort((a, b) => b - a);

                  return (
                    <React.Fragment key={role}>
                      <div className='filmography'>
                        {years.map(year => {
                          const yearGroup = groupedByYear[year];
                          if (!yearGroup || yearGroup.length === 0) return null;
                          return (
                            <React.Fragment key={year}>
                              <div className='year-header'>
                                <Circle size={32} />
                                <h4>{year}</h4>
                              </div>
                              <div className="year-group">
                                {yearGroup.map(media => (
                                  <Cards key={media.credit_id || `${media.id}-${year}`} {...media} />
                                ))}
                              </div>
                            </React.Fragment>
                          );
                        })}
                        {/* Render "Date Unknown" section if there are any */}
                        {groupedByYear['unknown'] && groupedByYear['unknown'].length > 0 && (
                          <React.Fragment key="unknown">
                            <div className='year-header'>
                              <Circle size={32} />
                              <h4>Date Unknown</h4>
                            </div>
                            <div className="year-group">
                              {groupedByYear['unknown'].map(media => (
                                <Cards key={media.credit_id || `unknown-${media.id}`} {...media} />
                              ))}
                            </div>
                          </React.Fragment>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
            </>
          )}
        </div>
      </main>
      </>
    );
}