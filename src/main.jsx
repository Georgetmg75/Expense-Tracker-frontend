import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './tailwind.css'; // ✅ Tailwind entry point


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
