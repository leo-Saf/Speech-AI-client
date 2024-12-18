import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider } from './components/LanguageContext';
import Home from './components/Home';
import Login from './components/Login';
import AuthModal from './components/AuthModal';
import HistoryPage from './components/HistoryPage';
import AudioUploader from './components/AudioUploader';
import TranscriptHandler from './components/TranscriptHandler';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import './style.css';

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
    <LanguageProvider>
      <Router>
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
              <Route 
                path="/inspelning" 
                element={
                  <div>
                    <TranscriptHandler />
                    <AudioUploader />
                  </div>
                } 
              />
              <Route path="/" element={<Home />} />
            </Routes>
          )}

          {showAuthModal && (
            <AuthModal
              mode={currentScreen}
              onClose={handleCloseAuthModal}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;