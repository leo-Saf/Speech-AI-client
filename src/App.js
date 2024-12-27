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
import { toast, ToastContainer } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Toast container styles
import TranscriptHandler from './components/TranscriptHandler';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import './style.css';
const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);  // State to track if the user is authenticated
  const [user, setUser] = useState(null); // State to store the authenticated user's information
  const [authMode, setAuthMode] = useState(null); // State to control which modal (Login/Register) should be shown

  // Callback to handle successful registration
  const handleRegisterSuccess = () => {
    setAuthMode(null); // Close the authentication modal
    toast.success('Registration successful! Please log in to continue.'); // Show a success message
  };

   // Callback to handle successful login
  const handleLoginSuccess = (userData) => {
    console.log('User data from the backend:', userData); // Log the user data for debugging
    // Check the alternative structures if userId exists
    if (userData?.userId) {
      // If login is successful, update the authentication state and user data
      setIsAuthenticated(true);
      setUser({
        id: userData.userId,
        email: userData.Email,
        admin: userData.Admin, // Store admin status for later use
      });
    setAuthMode(null); // Close the authentication modal
    toast.success('Login successful! Welcome back.');// Show a success message
    }
   else {
     // If userId is not found, show an error message
    toast.error('Login failed! No user ID found.');
   }
  };

  // Callback to handle logging out
  const handleLogout = () => {
    setIsAuthenticated(false); // Set authentication to false
    setUser(null); // Clear the user data
    toast.info('You have logged out.'); // Show a log out message
  };

  // Callback to close the authentication modal without action
  const handleAuthClose = () => {
    setAuthMode(null); // Close the authentication modal
  };

  import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppRouter = () => {
  const [authMode, setAuthMode] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setAuthMode(null);
  };

  const handleRegisterSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
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
                      <div>
                        <TranscriptHandler />
                        <AudioUploader userId={user?.id} />
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
                      <div>
                        <TranscriptHandler />
                        <AudioUploader userId={null} />
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