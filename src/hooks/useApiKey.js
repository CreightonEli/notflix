import { useState, useEffect } from 'react';

export default function useApiKey() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('tmdbApiKey') || '');

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('tmdbApiKey', apiKey);
    }
  }, [apiKey]);

  return [apiKey, setApiKey];
}