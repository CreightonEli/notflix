import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // <-- Change here
import './scss/style.scss';
import Header from './components/Header';
import App from './App.jsx';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop.js';
import { HeaderVisibilityProvider } from './context/HeaderVisibilityContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <HeaderVisibilityProvider>
        <ScrollToTop />
        <Header />
        <App />
        <Footer />
      </HeaderVisibilityProvider>
    </HashRouter>
  </StrictMode>
);
