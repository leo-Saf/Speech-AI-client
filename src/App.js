import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider } from './components/LanguageContext';
import Home from './components/Home';
import HistoryPage from './components/HistoryPage';
import AudioUploader from './components/AudioUploader';
import AdminPage from './components/Admin/AdminPage'; 
import Register from './components/Register';
import Login from './components/Login';
import { AllConversations } from './components/Admin/AllConversations';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TranscriptHandler from './components/TranscriptHandler';
//import { signOut, onAuthStateChanged } from 'firebase/auth';
//import { auth } from './firebaseConfig';
//import './style.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegisterSuccess = () => {
    setAuthMode(null);
    toast.success('Registration successful! Please log in to continue.');
  };

  const handleLoginSuccess = (userData) => {
    console.log('User data from the backend:', userData);
    if (userData?.userId) {
      setIsAuthenticated(true);
      setUser({
        id: userData.userId,
        email: userData.Email,
        admin: userData.Admin,
      });
      setAuthMode(null);
      toast.success('Login successful! Welcome back.');
    } else {
      toast.error('Login failed! No user ID found.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    toast.info('You have logged out.');
  };

  const handleAuthClose = () => {
    setAuthMode(null);
  };

  return (
    <LanguageProvider>
      <Router>
        <div>
          <ToastContainer position="top-center" autoClose={3000} />
          <nav className="auth-buttons">
            <h1 className="site-title">Speech AI</h1>
            {isAuthenticated ? (
              <>
                <span className="span">Welcome {user ? user.email : 'User'}</span>
                <Link to="/">
                  <button className="home-button">Home</button>
                </Link>
                <Link to="/historik">
                  <button>View History</button>
                </Link>
                <Link to="/Recording">
                  <button>Recording</button>
                </Link>
                <button className="Logout" onClick={handleLogout}>
                  Logout
                </button>
                {user?.admin && (
                  <Link to="/admin">
                    <button className="admin-button">Admin Page</button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <span className="span">You are a guest</span>
                <Link to="/">
                  <button className="home-button">Home</button>
                </Link>
                <Link to="/historik">
                  <button>View History</button>
                </Link>
                <Link to="/Recording">
                  <button>Recording</button>
                </Link>
                <button onClick={() => setAuthMode('login')}>Login</button>
                <button onClick={() => setAuthMode('register')}>Register</button>
              </>
            )}
          </nav>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <Routes>
              {isAuthenticated ? (
                <>
                  <Route
                    path="/historik"
                    element={<HistoryPage userId={user?.id} />}
                  />
                  <Route
                    path="/Recording"
                    element={
                      <div className ="home-container">
                        <AudioUploader userId={user?.id} />
                        <TranscriptHandler />
                      </div>
                    }
                  />
                  {user?.admin && (
                    <>
                      <Route path="/admin" element={<AdminPage user={user} />} />
                      <Route
                        path="/AllConversations"
                        element={<AllConversations />}
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <Route
                    path="/historik"
                    element={<HistoryPage userId={null} />}
                  />
                  <Route
                    path="/Recording"
                    element={
                      <div className ="home-container">
                        <AudioUploader userId={null} />
                        <TranscriptHandler />
                      </div>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <h2>You need to log in to access this page.</h2>
                        <button onClick={() => setAuthMode('login')}>Login</button>
                      </div>
                    }
                  />
                </>
              )}
              <Route path="/" element={<Home user={user} />} />
            </Routes>
          )}

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
    </LanguageProvider>
  );
};

export default App;