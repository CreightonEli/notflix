import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass, List, ListHeart, Gear } from "@phosphor-icons/react";
import { useHeaderVisibility } from '../context/HeaderVisibilityContext';
import { useState, useEffect } from "react";
import logoFull from '../assets/logo_full.png'; // Use relative path
import logoSmall from '../assets/logo_small.png'; // Use relative path

export default function Header() {
    const { isHeaderVisible } = useHeaderVisibility();
    const navigate = useNavigate();
    const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia("(max-width: 950px)").matches);
    const [dropdownOpen, setDropdownOpen] = useState(false); // Add state

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
                    alt="Nullflix Logo" 
                />
            </Link>
            <div className="header-right">
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
                <button
                    className="dropdown-btn"
                    onClick={() => setDropdownOpen((open) => !open)}
                    aria-expanded={dropdownOpen}
                >
                    <List size={18} />
                </button>
            </div>
            <nav
                className={`dropdown-menu${dropdownOpen ? " open" : ""}`}
                onMouseLeave={() => setDropdownOpen(false)}
            >
                <ul>
                    <li>
                        <Link
                            to="/lists"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <ListHeart size={24} />
                            Lists
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/settings"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <Gear size={24} />
                            Settings
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}