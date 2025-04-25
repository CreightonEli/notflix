import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import Show from "./pages/Show";
import Person from "./pages/Person";
import Results from "./pages/Results";
import Modal from './components/Modal';
import useApiKey from './hooks/useApiKey';

function App() {
  const [apiKey, setApiKey] = useApiKey();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open the modal if the API key is not set
  useEffect(() => {
    if (!apiKey) {
      setIsModalOpen(true);
    }
  }, [apiKey]);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApiKeySet={(key) => setApiKey(key)} // Pass the valid API key to the parent
      />
      {apiKey && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:id" element={<Movie />} />
          <Route path="/shows/:id" element={<Show />} />
          <Route path="/person/:id" element={<Person />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      )}
    </>
  );
}

export default App;