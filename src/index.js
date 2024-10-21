import React from 'react';
import ReactDOM from 'react-dom/client'; // Importera root istället
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Skapa root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
