import logoSmallShadow from '../assets/logo_small_shadow.png';

export default function Settings() {
    // Erase API key from localStorage
    const handleEraseApiKey = () => {
        localStorage.removeItem("tmdbApiKey");
        // alert("API key erased.");
        window.location.reload();
    };

    // Erase watchlist data
    const handleEraseWatchlist = () => {
        localStorage.removeItem("watchlist");
        // alert("Watchlist erased.");
    };

    return (
        <main className="settings-page">
            
            <title>Settings - Nullflix</title>
            <meta property="og:title" content="Settings" />
            <meta property="og:site_name" content="Nullflix" />
            <meta name="description" content="Settings page of Nullflix, allowing users to manage their preferences." />
            <meta property="og:description" content="Settings page of Nullflix, allowing users to manage their preferences." />
            <meta property="og:image" content={`https://nullflix.vercel.app${logoSmallShadow}`} />
            <meta property="og:url" content={`https://nullflix.vercel.app/#/settings`} />
            <meta property="og:type" content="website" />

            <h2>Settings</h2>
            <div>
                <h3>Erasing TMDB API Key</h3>
                <p>If you would like to use a different key, delete the current one here first.</p>
                <div>
                    <button onClick={handleEraseApiKey}>Delete API Key</button>
                    <a href="https://developer.themoviedb.org/v4/docs/getting-started" target="_blank">
                        <button>TMDB API</button>
                    </a>
                </div>
                <h3>Erasing Watchlist Data</h3>
                <p>In case you want to start from scratch.</p>
                <div>
                    <button onClick={handleEraseWatchlist}>Delete Watchlist Data</button>
                </div>
            </div>
        </main>
    );
}