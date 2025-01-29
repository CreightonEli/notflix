import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Movie from "./pages/Movie"
import Show from "./pages/Show"
import Results from "./pages/Results"

function App() {
  return (
    <Routes>
      {/* Define your routes here */}
      <Route path="/" element={<Home />} />
      <Route path="/movies/:id" element={<Movie />} />
      <Route path="/shows/:id" element={<Show />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}

export default App;