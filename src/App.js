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

  const handleRegisterSuccess = () => {
    setAuthMode(null); // Stänger modalen
    toast.success('Registrering lyckades! Logga in för att fortsätta.');
  };

  const handleLoginSuccess = (userData) => {
    console.log('Användardata från backend:', userData); // Logga användardata
    // Kontrollera alternativa strukturer
    if (userData?.userId) {
      setIsAuthenticated(true);
      setUser({
        id: userData.userId,
        email: userData.Email,
        admin: userData.Admin,
      });
    setAuthMode(null); // Stänger modalen
    toast.success('Inloggning lyckades! Välkommen.');
    }
   else {
    toast.error('Inloggning misslyckades! Ingen användar-ID hittades.');
   }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    toast.info('Du har loggat ut.');
  };

  const handleAuthClose = () => {
    setAuthMode(null); // Stänger authMode
  };

  return (
    <Router>
      
      
      <div>
        <ToastContainer position="top-center" autoClose={3000} />
        <nav className="auth-buttons">
          
          {isAuthenticated ? (
            <>
            
              <span>Welcome, {user ? user.Email : 'User'}</span>
              <Link to="/">
             <button className="home-button">Home</button> 
             </Link>
              <button className="logout" onClick={handleLogout}>
                Log out
              </button>
              <Link to="/historik">
                <button>Show history</button>
                
              </Link>
              <Link to="/inspelning">
                <button>Recording</button>
              </Link>
            </>
          ) : (
            <>
              <span>You are participating as a guest.</span>
              <Link to="/historik">
            <button>Show history</button>
          </Link>
          <Link to="/">
             <button className="home-button">Home</button> 
             </Link>
              <button onClick={() => setAuthMode('login')}>Login</button>
              <button onClick={() => setAuthMode('register')}>Register</button>
              
          
          
            </>
          )}
        </nav>

        <Routes>
  {/* För inloggade användare */}
  {isAuthenticated ? (
    <>
      <Route
        path="/historik"
        element={<HistoryPage userId={user?.id} />}
      />
      <Route
        path="/inspelning"
        element={<AudioUploader userId={user?.id} />}
      />
    </>
  ) : (
    /* För gäster */
    <>
      <Route
        path="/historik"
        element={<HistoryPage userId={null} />} // Passa null för gäst
      />
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

  {/* Vanliga sidor */}
  <Route path="/" element={<Home user={user} />} />
</Routes>


        {/* Rendera modal för inloggning/registrering endast när en knapp trycks */}
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