import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useHeaderVisibility } from '../context/HeaderVisibilityContext';

export default function Header() {
    const { isHeaderVisible } = useHeaderVisibility();
    const navigate = useNavigate();

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
            {/* <h1 className="logo"> */}
                <Link to={'/'}>
                    {/* NOTFLIX */}
                    <img className="logo" src={'../src/assets/logo_full.png'} alt="Notflix Logo" />
                </Link>
            {/* </h1> */}
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