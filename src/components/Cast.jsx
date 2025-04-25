import { Link } from "react-router-dom";
import { User } from "@phosphor-icons/react";

export default function Cast(props) {

    console.log(props?.aggregate_credits?.crew)

    return (
        <>
            {props?.credits?.cast ? ( // Display cast for movies
                <div className="cast-container">
                    <p><span className="heading">Cast</span></p>
                    <div className="cast-wrapper">
                        {props?.credits?.cast && (props?.credits?.cast?.map((person) => (
                            <div className="person-card" key={person.id}>
                                {person.profile_path ? (
                                    <div className="img-wrapper">
                                        <Link to={`/person/${person.id}`}>
                                            <img src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} alt={`Picture of ${person.name}.`} />
                                        </Link>
                                    </div>
                                ):
                                    <div className="img-wrapper">
                                        <Link to={`/person/${person.id}`}>
                                            <User size={64} />
                                        </Link>
                                    </div>
                                }
                                <span className="person-name">
                                    <Link to={`/person/${person.id}`}>
                                        {person.name}
                                    </Link>
                                </span>
                                <span className="person-role">
                                    <Link to={`/person/${person.id}`}>
                                        {person.character}
                                    </Link>
                                </span>
                            </div>
                        )))}
                    </div>
                    <p><span className="heading">Crew</span></p>
                    <div className="crew-wrapper">
                        {props?.credits?.crew && (() => {
                            // Group crew members by department
                            const crewByDepartment = props.credits.crew.reduce((acc, person) => {
                                if (!acc[person.department]) {
                                    acc[person.department] = [];
                                }
                                acc[person.department].push(person);
                                return acc;
                            }, {});

                            // Render each department with its members
                            return Object.entries(crewByDepartment).map(([department, members]) => (
                                <div key={department} className="department-section">
                                    <span className="department-heading">{department}</span>
                                    <ul className="department-list">
                                        {members.map((person) => (
                                            <li className="person-li" key={person.id}>
                                                <span className="person-name">
                                                    <Link to={`/person/${person.id}`}>
                                                        {person.name}
                                                    </Link>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            ) : ( // Display aggregate cast for series
                <div className="cast-container">
                    <p><span className="heading">Cast</span></p>
                    <div className="cast-wrapper">
                        {props?.aggregate_credits?.cast && (props?.aggregate_credits?.cast?.map((person) => (
                            <div className="person-card" key={person.id}>
                                {person.profile_path ? (
                                    <div className="img-wrapper">
                                        <Link to={`/person/${person.id}`}>
                                            <img src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} alt={`Picture of ${person.name}.`} />
                                        </Link>
                                    </div>
                                ):
                                    <div className="img-wrapper">
                                        <Link to={`/person/${person.id}`}>
                                            <User size={64} />
                                        </Link>
                                    </div>
                                }
                                <span className="person-name">
                                    <Link to={`/person/${person.id}`}>
                                        {person.name}
                                    </Link>
                                </span>
                                <span className="person-role">
                                    <Link to={`/person/${person.id}`}>
                                        {person.roles[0].character}
                                    </Link>
                                </span>
                            </div>
                        )))}
                    </div>
                    <p><span className="heading">Crew</span></p>
                    <div className="crew-wrapper">
                        {props?.aggregate_credits?.crew && (() => {
                            // Group crew members by department
                            const crewByDepartment = props.aggregate_credits.crew.reduce((acc, person) => {
                                if (!acc[person.department]) {
                                    acc[person.department] = [];
                                }
                                acc[person.department].push(person);
                                return acc;
                            }, {});

                            // Render each department with its members
                            return Object.entries(crewByDepartment).map(([department, members]) => (
                                <div key={department} className="department-section">
                                    <span className="department-heading">{department}</span>
                                    <ul className="department-list">
                                        {members.map((person) => (
                                            <li className="person-li" key={person.id}>
                                                <span className="person-name">
                                                    <Link to={`/person/${person.id}`}>
                                                        {person.name}
                                                    </Link>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

            )}
        </>
    )
}