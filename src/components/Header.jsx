import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useHeaderVisibility } from '../context/HeaderVisibilityContext';
import { useState, useEffect } from "react";
import logoFull from '../assets/logo_full.png'; // Use relative path
import logoSmall from '../assets/logo_small.png'; // Use relative path

export default function Header() {
    const { isHeaderVisible } = useHeaderVisibility();
    const navigate = useNavigate();
    const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia("(max-width: 950px)").matches);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 950px)");
        const handleResize = () => setIsSmallScreen(mediaQuery.matches);

        mediaQuery.addEventListener("change", handleResize);
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const query = event.target.elements.query?.value;
        if (query) {
            navigate(`/results?search=${encodeURIComponent(query)}`);
        } else {
            console.error("Query input is missing or empty.");
        }
    };

    if (!isHeaderVisible) return null; // Hide the header if not visible

    return (
        <header>
            <Link to={`/`}>
                <img 
                    className="logo" 
                    src={isSmallScreen ? logoSmall : logoFull} 
                    alt="Notflix Logo" 
                />
            </Link>
            <form onSubmit={handleSubmit}>
                <input 
                    className="search-box"
                    name="query"
                    type="text" 
                    placeholder="Search"
                    required
                />
                <button className="search-btn" type="submit" ><MagnifyingGlass size={18} /></button>
            </form>
        </header>
    );
}