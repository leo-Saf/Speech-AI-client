import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import HistoryPage from './components/HistoryPage';
import AudioUploader from './components/AudioUploader';
import Register from './components/Register';
import Login from './components/Login';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Håller koll på om användaren är inloggad
  const [user, setUser] = useState(null); // Sparar information om den inloggade användaren
  const [authMode, setAuthMode] = useState(null); // Styr vilken modal (Login/Register) som ska visas

  // Hantering av lyckad registrering
  const handleRegisterSuccess = () => {
    setAuthMode(null); // Stänger modalen
    toast.success('Registrering lyckades! Logga in för att fortsätta.');
  };

  // Hantering av lyckad inloggning
  const handleLoginSuccess = (userData) => {
    console.log('Användardata från backend:', userData);
    if (userData?.userId) {
      setIsAuthenticated(true);
      setUser({
        id: userData.userId,
        email: userData.Email,
        admin: userData.Admin,
      });
      setAuthMode(null); // Stänger modalen
      toast.success('Inloggning lyckades! Välkommen.');
    } else {
      toast.error('Inloggning misslyckades! Ingen användar-ID hittades.');
    }
  };

  // Hantering av utloggning
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    toast.info('Du har loggat ut.');
  };

  return (
    <Router>
      <div>
        <ToastContainer position="top-center" autoClose={3000} />

        {/* Navigation */}
        <nav className="navbar">
          <div className="navbar-brand">
            <Link to="/" className="brand-logo">SpeechAI</Link>
          </div>
          <ul className="navbar-links">
            {isAuthenticated ? (
              <>
                <li>Välkommen, {user ? user.email : 'Användare'}</li>
                <li><Link to="/">Hem</Link></li>
                <li><Link to="/historik">Visa Historik</Link></li>
                <li><Link to="/inspelning">Inspelning</Link></li>
                <li>
                  <button className="logout" onClick={handleLogout}>Logga ut</button>
                </li>
              </>
            ) : (
              <>
                <li className="guest-message">Du är som gäst.</li>
                <li><Link to="/historik" >Visa Historik</Link></li>
                <li><Link to="/">Hem</Link></li>
                <li><button onClick={() => setAuthMode('login')}>Logga in</button></li>
                <li><button onClick={() => setAuthMode('register')}>Registrera</button></li>
              </>
            )}
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          {isAuthenticated ? (
            <>
              <Route path="/historik" element={<HistoryPage userId={user?.id} />} />
              <Route path="/inspelning" element={<AudioUploader userId={user?.id} />} />
            </>
          ) : (
            <>
              <Route path="/historik" element={<HistoryPage  />} />
              <Route
                path="*"
                element={
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <h2>Du måste logga in för att komma åt denna sida.</h2>
                    <button onClick={() => setAuthMode('login')}>Logga in</button>
                  </div>
                }
              />
            </>
          )}
        </Routes>

        {/* Modal för autentisering */}
        {authMode === 'login' && (
          <div className="auth-container">
            <Login
              onLoginSuccess={handleLoginSuccess}
              onClose={() => setAuthMode(null)}
            />
          </div>
        )}
        {authMode === 'register' && (
          <div className="auth-container">
            <Register
              onRegisterSuccess={handleRegisterSuccess}
              onClose={() => setAuthMode(null)}
            />
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
