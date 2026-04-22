import { Link } from "react-router-dom";

export default function Details(props) {
    // console.log(props.belongs_to_collection);

    return (
        <div className="collection">
            <div className="collection-backdrop" style={props.belongs_to_collection.backdrop_path ? { backgroundImage: `url(https://image.tmdb.org/t/p/original${props.belongs_to_collection.backdrop_path})` } : { backgroundColor: 'var(--dark)' }}>
                <div>
                    <img className="collection-poster" src={`https://image.tmdb.org/t/p/w500${props.belongs_to_collection.poster_path}`} alt={props.belongs_to_collection.name} />
                    <div className="collection-info">
                        <h2>{props.belongs_to_collection.name}</h2>
                        <Link to={`/collection/${props.belongs_to_collection.id}`}>
                            <button>
                                View Collection
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}