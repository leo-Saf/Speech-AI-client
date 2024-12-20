import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import HistoryPage from './components/HistoryPage';
import AudioUploader from './components/AudioUploader';
import Register from './components/Register';
import Login from './components/Login';
import AddUser from './components/AddUser';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [emails, setEmails] = useState([]); // State to store an array of emails
  const [showAddUserModal, setShowAddUserModal] = useState(false); // State to control modal visibility

  const handleFetchAndResetEmails = () => {
    const currentEmails = [...emails]; // Clone the emails
    setEmails([]); // Reset the emails array
    return currentEmails;
  };
  
  // Function to handle the email passed from AddUser
  const handleEmailSubmit = (email) => {
    setEmails((prevEmails) => [...prevEmails, email]); // Add new email to the array
    toast.success('User added: ' + email); // Optional: Notify the user
  };

  const handleRegisterSuccess = () => {
    setAuthMode(null);
    toast.success('Registrering lyckades! Logga in för att fortsätta.');
  };

  const handleLoginSuccess = (userData) => {
    if (userData?.userId) {
      setIsAuthenticated(true);
      setUser({
        id: userData.userId,
        email: userData.Email,
        admin: userData.Admin,
      });
    setAuthMode(null);
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
              <span>Välkommen, {user ? user.Email : 'Användare'}</span>
              <button className="logout" onClick={handleLogout}>
                Logga ut
              </button>
              <Link to="/historik">
                <button>Visa Historik</button>
              </Link>
              <Link to="/inspelning">
                <button>Inspelning</button>
              </Link>
              <button onClick={() => setShowAddUserModal(true)}>Add User</button> 
            </>
          ) : (
            <>
              <span>Du är som gäst.</span>
              <button onClick={() => setAuthMode('login')}>Logga in</button>
              <button onClick={() => setAuthMode('register')}>Registrera</button>
            </>
          )}
        </nav>

        {/* Routes */}
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/historik" element={<HistoryPage userId={user?.id} />} />
              <Route path="/inspelning" element={<AudioUploader userId={user?.id} />} />
            </>
          ) : (
            <Route
              path="*"
              element={
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <h2>Du måste logga in för att komma åt denna sida.</h2>
                  <button onClick={() => setAuthMode('login')}>Logga in</button>
                </div>
              }
            />
          )}
          <Route path="/" element={<Home user={user} />} />
        </Routes>

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="modal">
            <div className="modal-content">
              <button className="close" onClick={() => setShowAddUserModal(false)}>
                &times;
              </button>
              {/* Pass the handleEmailSubmit function to AddUser */}
              <AddUser onEmailSubmit={handleEmailSubmit} />
            </div>
          </div>
        )}

        {/* Render Login/Register Modals */}
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

        {/* Display the list of emails under "Lägg till" button */}
        <div className="added-users-list">
          <h3>Added Users:</h3>
          <ul>
            {emails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </div>
      </div>
    </Router>
  );
};

export default App;
