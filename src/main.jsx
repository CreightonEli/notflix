import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './scss/style.scss';
import Header from './components/Header';
import App from './App.jsx';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop.js';
import { HeaderVisibilityProvider } from './context/HeaderVisibilityContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <HeaderVisibilityProvider>
        <ScrollToTop />
        <Header />
        <App />
        <Footer />
      </HeaderVisibilityProvider>
    </BrowserRouter>
  </StrictMode>
);
