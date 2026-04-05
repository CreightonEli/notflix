
import { PlayCircle, MagnifyingGlassPlus } from "@phosphor-icons/react";
import { useState } from "react";

export default function Details(props) {
    const [activeMedia, setActiveMedia] = useState(
        props.videos?.results?.length > 0 ? "videos" : "images"
    ); // Default to "videos" if available, otherwise "images"
    return (
        <>     
            <div className="media-container">
                <div className="media-header">
                    <h2>Media</h2>
                    <div>
                        {props.videos?.results?.length > 0 && (
                            <h3 
                                className={activeMedia === "videos" ? "active" : ""} 
                                onClick={() => setActiveMedia("videos")}
                            >
                                Videos <span>{props.videos.results.length}</span>
                            </h3>
                        )}
                        {props.images?.backdrops?.length > 0 && (
                            <h3 
                                className={activeMedia === "backdrops" ? "active" : ""} 
                                onClick={() => setActiveMedia("backdrops")}
                            >
                                Backdrops <span>{props.images.backdrops.length}</span>
                            </h3>
                        )}
                        {props.images?.posters?.length > 0 && (
                            <h3 
                                className={activeMedia === "posters" ? "active" : ""} 
                                onClick={() => setActiveMedia("posters")}
                            >
                                Posters <span>{props.images.posters.length}</span>
                            </h3>
                        )}
                        {props.images?.logos?.length > 0 && (
                            <h3 
                                className={activeMedia === "logos" ? "active" : ""} 
                                onClick={() => setActiveMedia("logos")}
                            >
                                Logos <span>{props.images.logos.length}</span>
                            </h3>
                        )}
                    </div>
                </div>                        
                <div className="media-gallery">
                    {activeMedia === "videos" && props.videos?.results?.map((video, index) => (
                        <a href={`https://www.youtube.com/watch?v=${video.key}`} target="_blank" key={index}>
                            <PlayCircle size={50} weight="fill" />
                            <img src={`https://img.youtube.com/vi/${video.key}/0.jpg`} alt={`Trailer ${index + 1}`} />
                        </a>
                    ))}
                    {activeMedia === "backdrops" && props.images?.backdrops?.map((image, index) => (
                        <a href={`https://image.tmdb.org/t/p/original${image.file_path}`} target="_blank" key={index}>
                            <MagnifyingGlassPlus size={50} />
                            <img key={index} src={`https://image.tmdb.org/t/p/w500${image.file_path}`} alt={`Backdrop ${index + 1}`} />
                        </a>
                    ))}
                    {activeMedia === "posters" && props.images?.posters?.map((image, index) => (
                        <a className="posters" href={`https://image.tmdb.org/t/p/original${image.file_path}`} target="_blank" key={index}>
                            <MagnifyingGlassPlus size={50} />
                            <img key={index} src={`https://image.tmdb.org/t/p/w500${image.file_path}`} alt={`Backdrop ${index + 1}`} />
                        </a>
                    ))}
                    {activeMedia === "logos" && props.images?.logos?.map((image, index) => (
                        <a href={`https://image.tmdb.org/t/p/original${image.file_path}`} target="_blank" key={index}>
                            <MagnifyingGlassPlus size={50} />
                            <img key={index} src={`https://image.tmdb.org/t/p/w500${image.file_path}`} alt={`Backdrop ${index + 1}`} />
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}