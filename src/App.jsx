// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
<<<<<<< Updated upstream:src/App.jsx
import MinHistoria from './components/MinHistoria';
import About from './components/About';
import './style.css'; // Importera din CSS-fil
import SetupAI from './components/SetupAI';
=======
import Login from './components/Login';
import AuthModal from './components/AuthModal';
import HistoryPage from './components/HistoryPage';
import AudioUploader from './components/AudioUploader';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import './style.css';
>>>>>>> Stashed changes:src/App.js

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenAuthModal = (mode) => {
    setCurrentScreen(mode);
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleLoginSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <Router>
<<<<<<< Updated upstream:src/App.jsx
      <div className="App">
        <nav>
          <ul style={{ display: 'flex', justifyContent: 'space-around', listStyle: 'none', padding: 0 }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/min-historia">History</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/setup-ai">Set up AI</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/min-historia" element={<MinHistoria />} />
          <Route path="/about" element={<About />} />
          <Route path="/setup-ai" element={<SetupAI />} />
        </Routes>
=======
      <div>
        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <span>Välkommen, {user.displayName || 'Användare'}</span>
              <button className="logout" onClick={handleLogout}>Logga ut</button>
              <Link to="/historik">
                <button>Visa Historik</button>
              </Link>
              
            </>
          ) : (
            <>
              <button onClick={() => handleOpenAuthModal('login')}>Logga in</button>
              <button onClick={() => handleOpenAuthModal('register')}>Registrera</button>
            </>
          )}
        </div>

        {loading ? (
          <div>Laddar...</div>
        ) : (
          <Routes>
            <Route path="/historik" element={<HistoryPage />} />
            <Route path="/inspelning" element={<AudioUploader />} />
            <Route path="/" element={<Home />} />
          </Routes>
        )}

        {showAuthModal && (
          <AuthModal 
            mode={currentScreen} 
            onClose={handleCloseAuthModal} 
            onLoginSuccess={handleLoginSuccess} // Skicka in funktionen som prop
          />
        )}
>>>>>>> Stashed changes:src/App.js
      </div>
    </Router>
  );
};

export default App;
