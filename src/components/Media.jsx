
import { PlayCircle, MagnifyingGlassPlus, CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Details(props) {
    const [activeMedia, setActiveMedia] = useState(
        props.videos?.results?.length > 0 ? "videos" : "images"
    ); // Default to "videos" if available, otherwise "images"
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

    // Get current media array based on active type
    const getMediaArray = () => {
        if (activeMedia === "videos") return props.videos?.results || [];
        if (activeMedia === "backdrops") return props.images?.backdrops || [];
        if (activeMedia === "posters") return props.images?.posters || [];
        if (activeMedia === "logos") return props.images?.logos || [];
        return [];
    };

    const mediaArray = getMediaArray();
    const currentMedia = mediaArray[selectedMediaIndex];

    const openModal = (index) => {
        setSelectedMediaIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsClosing(true);
        // Wait for animation to complete before closing
        setTimeout(() => {
            setIsModalOpen(false);
            setIsClosing(false);
        }, 300); // Match this to your CSS animation duration
    };

    const goToPrevious = () => {
        setSelectedMediaIndex((prev) => (prev === 0 ? mediaArray.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setSelectedMediaIndex((prev) => (prev === mediaArray.length - 1 ? 0 : prev + 1));
    };

    const getMediaUrl = () => {
        if (activeMedia === "videos" && currentMedia?.key) {
            return `https://www.youtube.com/watch?v=${currentMedia.key}`;
        }
        if (currentMedia?.file_path) {
            return `https://image.tmdb.org/t/p/original${currentMedia.file_path}`;
        }
        return "";
    };

    const renderModal = () => {
        if (!isModalOpen || !currentMedia) return null;

        const modalContent = (
            <div className={`media-modal-overlay ${isClosing ? 'closing' : 'opening'}`} onClick={closeModal}>
                <div className={`media-modal-content ${isClosing ? 'closing' : 'opening'}`} onClick={(e) => e.stopPropagation()}>
                    {/* Close button */}
                    <button className="media-modal-close" onClick={closeModal}>
                        <X size={32} />
                    </button>

                    {/* Left navigation button */}
                    <button className="media-modal-nav-btn left" onClick={goToPrevious}>
                        <CaretLeft size={40} weight="fill" />
                    </button>

                    {/* Media display */}
                    <div className="media-modal-display">
                        {activeMedia === "videos" && currentMedia?.key ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${currentMedia.key}`}
                                title="Video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                            />
                        ) : (
                            <img
                                src={`https://image.tmdb.org/t/p/original${currentMedia?.file_path}`}
                                alt={`Media ${selectedMediaIndex + 1}`}
                            />
                        )}
                    </div>

                    {/* Right navigation button */}
                    <button className="media-modal-nav-btn right" onClick={goToNext}>
                        <CaretRight size={40} weight="fill" />
                    </button>

                    {/* Counter */}
                    <div className="media-modal-counter">
                        {selectedMediaIndex + 1} / {mediaArray.length}
                    </div>
                </div>
            </div>
        );

        return createPortal(modalContent, document.body);
    };

    return (
        <>     
            <div className="media-container">
                <div className="media-header">
                    <h2>Media</h2>
                    <div>
                        {props.videos?.results?.length > 0 && (
                            <h3 
                                className={activeMedia === "videos" ? "active" : ""} 
                                onClick={() => {
                                    setActiveMedia("videos");
                                    setSelectedMediaIndex(0);
                                }}
                            >
                                Videos <span>{props.videos.results.length}</span>
                            </h3>
                        )}
                        {props.images?.backdrops?.length > 0 && (
                            <h3 
                                className={activeMedia === "backdrops" ? "active" : ""} 
                                onClick={() => {
                                    setActiveMedia("backdrops");
                                    setSelectedMediaIndex(0);
                                }}
                            >
                                Backdrops <span>{props.images.backdrops.length}</span>
                            </h3>
                        )}
                        {props.images?.posters?.length > 0 && (
                            <h3 
                                className={activeMedia === "posters" ? "active" : ""} 
                                onClick={() => {
                                    setActiveMedia("posters");
                                    setSelectedMediaIndex(0);
                                }}
                            >
                                Posters <span>{props.images.posters.length}</span>
                            </h3>
                        )}
                        {props.images?.logos?.length > 0 && (
                            <h3 
                                className={activeMedia === "logos" ? "active" : ""} 
                                onClick={() => {
                                    setActiveMedia("logos");
                                    setSelectedMediaIndex(0);
                                }}
                            >
                                Logos <span>{props.images.logos.length}</span>
                            </h3>
                        )}
                    </div>
                </div>                        
                <div className="media-gallery">
                    {activeMedia === "videos" && props.videos?.results?.map((video, index) => (
                        <button
                            className="media-gallery-item"
                            key={index}
                            onClick={() => openModal(index)}
                        >
                            <PlayCircle size={50} weight="fill" />
                            <img src={`https://img.youtube.com/vi/${video.key}/0.jpg`} alt={`Trailer ${index + 1}`} />
                        </button>
                    ))}
                    {activeMedia === "backdrops" && props.images?.backdrops?.map((image, index) => (
                        <button
                            className="media-gallery-item"
                            key={index}
                            onClick={() => openModal(index)}
                        >
                            <MagnifyingGlassPlus size={50} />
                            <img src={`https://image.tmdb.org/t/p/w500${image.file_path}`} alt={`Backdrop ${index + 1}`} />
                        </button>
                    ))}
                    {activeMedia === "posters" && props.images?.posters?.map((image, index) => (
                        <button
                            className="media-gallery-item posters"
                            key={index}
                            onClick={() => openModal(index)}
                        >
                            <MagnifyingGlassPlus size={50} />
                            <img src={`https://image.tmdb.org/t/p/w500${image.file_path}`} alt={`Poster ${index + 1}`} />
                        </button>
                    ))}
                    {activeMedia === "logos" && props.images?.logos?.map((image, index) => (
                        <button
                            className="media-gallery-item"
                            key={index}
                            onClick={() => openModal(index)}
                        >
                            <MagnifyingGlassPlus size={50} />
                            <img src={`https://image.tmdb.org/t/p/w500${image.file_path}`} alt={`Logo ${index + 1}`} />
                        </button>
                    ))}
                </div>
            </div>

            {renderModal()}
        </>
    );
}