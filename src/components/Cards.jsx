import { Link } from "react-router-dom";
import { Info, Star, StarHalf } from "@phosphor-icons/react"
export default function Cards(props) {
    
    const starSize = 20

    const starArray = [
        <><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /></>, 
        <><StarHalf size={starSize} weight="fill" /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /></>, 
        <><Star size={starSize} weight="fill" /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><StarHalf size={starSize} weight="fill" /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} /><Star size={starSize} /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><StarHalf size={starSize} weight="fill" /><Star size={starSize} /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><StarHalf size={starSize} weight="fill" /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><StarHalf size={starSize} weight="fill" /></>,
        <><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /><Star size={starSize} weight="fill" /></>
    ]
    
    return (
        <>
            {props.poster_path != null && (
                <div className="card">
                    <img src={"https://image.tmdb.org/t/p/w500/" + props.poster_path} className="movie-cover" />
                    {/* <span className="media-type">{props.title && ("Movie")}{props.name && ("TV")}</span> */}
                    <div className="text-content">
                        <h2 className="title">
                            {(props.title || props.name)} 
                        </h2>
                            {(props.release_date && props.release_date.split('-')[0])}
                            {(props.first_air_date && props.first_air_date.split('-')[0])}
                        {/* <p className="description">{props.overview}</p> */}
                        <div className="cards-rating">{starArray[parseInt(props.vote_average)]}</div>
                        {props.title && (
                            <Link to={`/movies/${props.id}`}><button>More info<Info size={18} /></button></Link>
                        )}
                        {props.name && (
                            <Link to={`/shows/${props.id}`}><button>More info<Info size={18} /></button></Link>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}