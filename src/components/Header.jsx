import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "@phosphor-icons/react"
export default function Header() {

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
    
        // Access the input value
        const query = event.target.elements.query?.value; // Safely access the value
        if (query) {
            navigate(`/results?search=${encodeURIComponent(query)}`);
        } else {
            console.error("Query input is missing or empty.");
        }
    };

    return (
        <header>
            <h1 className="logo">
                <Link to={'/'}>
                    NOTFLIX
                </Link>
            </h1>
            <ul>
                <li>
                    <Link to={'/'}>
                        Home
                    </Link>
                </li>
                <li><Link to={'/'}>
                        Movies
                    </Link>
                </li>
                <li>
                    <Link to={'/'}>
                        TV Shows
                    </Link>    
                </li>
            </ul>
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
    )
}