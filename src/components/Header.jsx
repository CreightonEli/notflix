import { Link, useNavigate } from "react-router-dom";
import { DiceSixIcon, MagnifyingGlass, List, ListHeart, Gear, ClockCounterClockwiseIcon  } from "@phosphor-icons/react";
import { useHeaderVisibility } from '../context/HeaderVisibilityContext';
import { useState, useEffect } from "react";
import useApiKey from '../hooks/useApiKey';
import logoFull from '../assets/logo_full.png'; // Use relative path
import logoSmall from '../assets/logo_small.png'; // Use relative path

export default function Header() {
    const { isHeaderVisible } = useHeaderVisibility();
    const navigate = useNavigate();
    const [apiKey] = useApiKey();
    const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia("(max-width: 950px)").matches);
    const [dropdownOpen, setDropdownOpen] = useState(false); // Add state
    const [isChoosingRandomTitle, setIsChoosingRandomTitle] = useState(false);

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

    const handleRandomTitle = async () => {
        if (isChoosingRandomTitle) return;

        setIsChoosingRandomTitle(true);
        const mediaType = Math.random() < 0.5 ? 'movie' : 'tv';
        const certificationLimit = mediaType === 'movie' ? 'R' : 'TV-14';
        const endpoint = `https://api.themoviedb.org/3/discover/${mediaType}?include_adult=false&certification_country=US&certification.lte=${certificationLimit}&language=en-US&sort_by=popularity.desc`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
        };

        try {
            const firstResponse = await fetch(`${endpoint}&page=1`, options);
            if (!firstResponse.ok) {
                throw new Error(`TMDB request failed (${firstResponse.status}).`);
            }

            const firstPage = await firstResponse.json();
            const totalPages = Math.min(firstPage.total_pages || 1, 500);
            const page = Math.floor(Math.random() * totalPages) + 1;
            let results = firstPage.results || [];

            if (page !== 1) {
                const randomPageResponse = await fetch(`${endpoint}&page=${page}`, options);
                if (!randomPageResponse.ok) {
                    throw new Error(`TMDB request failed (${randomPageResponse.status}).`);
                }
                const randomPage = await randomPageResponse.json();
                results = randomPage.results || [];
            }

            const eligibleResults = results.filter((item) => item.adult !== true);
            if (eligibleResults.length === 0) {
                throw new Error('TMDB did not return any eligible titles.');
            }

            const selectedTitle = eligibleResults[Math.floor(Math.random() * eligibleResults.length)];
            navigate(`/${mediaType === 'movie' ? 'movies' : 'shows'}/${selectedTitle.id}`);
        } catch (error) {
            console.error('Unable to choose a random title:', error);
            window.alert('Could not find a random title. Please try again.');
        } finally {
            setIsChoosingRandomTitle(false);
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
                <button
                    className="random-btn"
                    type="button"
                    onClick={handleRandomTitle}
                    disabled={isChoosingRandomTitle}
                    aria-label="Go to a random movie or TV show"
                    title="Random movie or TV show"
                >
                    <DiceSixIcon size={18} />
                </button>
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
                            My List
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/history"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <ClockCounterClockwiseIcon size={24} />
                            History
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