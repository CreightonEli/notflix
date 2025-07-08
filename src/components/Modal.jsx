import React, { useState } from 'react';
import logoSmall from '../assets/logo_small.png'; // Use relative path

export default function Modal({ isOpen, onClose, onApiKeySet }) {
  if (!isOpen) return null;

  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateApiKey = async (key) => {
    const testUrl = 'https://api.themoviedb.org/3/authentication/token/new'; // Endpoint for validating API key
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${key}`,
      },
    };

    try {
      const response = await fetch(testUrl, options);
      if (response.ok) {
        return true; // API key is valid
      } else {
        const data = await response.json();
        setErrorMessage(data.status_message || 'Invalid API Key. Please try again.');
        return false;
      }
    } catch (error) {
      setErrorMessage('An error occurred while validating the API Key.');
      return false;
    }
  };

  const handleButtonClick = async () => {
    if (!inputValue) {
      setErrorMessage('API Key is required to use this application.');
      return;
    }

    const isValid = await validateApiKey(inputValue);
    if (isValid) {
      localStorage.setItem('tmdbApiKey', inputValue); // Save the valid API key
      onApiKeySet(inputValue); // Notify the parent component
      onClose(); // Close the modal
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img className="logo" src={logoSmall} alt="Nullflix Logo" />
        <img className="logo-shadow" src={logoSmall} alt="Nullflix Logo" />
        <h2>Welcome to Nullflix!</h2>
        <p>Please submit your TMDB API key below to get started.</p>
        <input
          type="password"
          placeholder="TMDB API Key"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setErrorMessage(''); // Clear error message on input change
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleButtonClick(); // Trigger submission on Enter key press
            }
          }}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="modal-actions">
          <button className="submit-btn" onClick={handleButtonClick}>
            Submit
          </button>
          <a href="https://github.com/CreightonEli/Notflix/blob/main/README.md" target="_blank" rel="noopener noreferrer">
            <button>More Info</button>
          </a>
        </div>
      </div>
    </div>
  );
}