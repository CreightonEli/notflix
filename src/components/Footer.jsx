import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logoFull from '../assets/logo_full.png'; // Use relative path

export default function Footer() {
    const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia("(max-width: 950px)").matches);
    
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-top">
                    <div className="footer-logo">
                        <Link to={`/`}>
                            <img 
                                className="logo" 
                                src={logoFull} 
                                alt="Nullflix Logo" 
                            />
                        </Link>
                    </div>
                    <div className="footer-list">
                        <Link to={`/`}>Home</Link>
                        <Link to={`/lists`}>My List</Link>
                        <Link to={`/history`}>History</Link>
                        <Link to={`/settings`}>Settings</Link>
                        {/* <Link to={`/about`}>About</Link> */}
                    </div>
                </div>
                <div className="footer-info">
                </div>
                <p>Made with 💜 by <a href={"https://creightoneli.github.io"}>Elijah C.</a></p>
                <p>© 2025 Nullflix. All rights reserved.</p>
            </div>
        </footer>
    );
}