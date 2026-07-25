import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/index.css';
import App from './App';

// -------------------------------------------------------------------
// Application Entry Point
// Architecture.md section 9 — React Application Overview
// DeveloperGuide.md section 8 — Running the Project
// -------------------------------------------------------------------

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
