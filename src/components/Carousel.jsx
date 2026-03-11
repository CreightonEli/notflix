import { Link } from "react-router-dom";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useState, useEffect, useRef } from "react";
import Cards from "./Cards"; // Import your Cards component

export default function Carousel({ headline, id, type, mediaList = [], seeAllPath }) {
    // console.log("Media List:", mediaList);
    const galleryRef = useRef(null);
    const [showScroll, setShowScroll] = useState(false);

    // determine whether gallery overflows its container
    useEffect(() => {
        const update = () => {
            if (!galleryRef.current) return;
            setShowScroll(galleryRef.current.scrollWidth > galleryRef.current.clientWidth);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [mediaList]);

    // Scroll the gallery by a specific amount (e.g., width of 6 cards)
    const scrollGallery = (direction) => {
        if (!galleryRef.current) return;
        const scrollAmount = galleryRef.current.offsetWidth * 1; // 25% of the container's visible width
        
        galleryRef.current.scrollBy({
            left: direction === "right" ? scrollAmount : -scrollAmount,
            behavior: "smooth",
        });
    };

    if (mediaList.length > 0) {
        return (
            <div className="gallery-wrapper">
                <h3>
                    <Link to={seeAllPath || `/results?id=${id}&type=${type}` }>
                        {headline && (headline)}<span>See all<CaretRight /></span>
                    </Link>
                </h3>
                <div className="gallery-container">
                    <div className="gallery" ref={galleryRef}>
                        {mediaList && (mediaList.slice(0, 18).map((media) => (
                            <Cards key={media.id} {...media} />
                        )))}
                    </div>
                </div>
                {showScroll && (
                    <>
                        <button className="scroll-button left" onClick={() => scrollGallery('left')}><CaretLeft /></button>
                        <button className="scroll-button right" onClick={() => scrollGallery('right')}><CaretRight /></button>
                    </>
                )}
            </div>
        );
    }
    else {;}
}