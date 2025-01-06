import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider } from './components/LanguageContext';
import Home from './components/Home';
import HistoryPage from './components/HistoryPage';
import AudioUploader from './components/AudioUploader';
import AdminPage from './components/Admin/AdminPage';
import Register from './components/Register';
import Login from './components/Login';
import AddUser from './components/AddUser';
import { AllConversations } from './components/Admin/AllConversations';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TranscriptHandler from './components/TranscriptHandler';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [emails, setEmails] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    console.log('--------------------------- NEW EMAIL LOGS ----------------------------');
    console.log('Emails state updated:', emails);
  }, [emails]);

  const handleFetchEmails = () => {
    console.log('Fetching emails...');
    const currentEmails = [...emails];
    console.log('Fetched emails:', currentEmails);
    return currentEmails;
  };

  const handleResetEmails = () => {
    console.log('Resetting emails...');
    setEmails([]);
    console.log('Emails have been reset.');
  };

  const handleEmailSubmit = (email) => {
    console.log('Email received by App.js: ', email);
    setEmails((prevEmails) => {
      console.log('Previous emails array:', prevEmails);
      const updatedEmails = [...prevEmails, email];
      console.log('Updated emails array:', updatedEmails);
      return updatedEmails;
    });
    toast.success('User added: ' + email);
  };

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
                <Link to="/"><button className="home-button">Home</button></Link>
                <Link to="/historik"><button>View History</button></Link>
               
                <button onClick={() => setIsModalOpen(true)}>Add User</button>
      {isModalOpen && <AddUser onClose={() => setIsModalOpen(false)} />}
                <button className="Logout" onClick={handleLogout}>Logout</button>
                {user?.admin && (
                  <Link to="/admin"><button className="admin-button">Admin Page</button></Link>
                )}
              </>
            ) : (
              <>
                <span className="span">You are a guest</span>
                <Link to="/"><button className="home-button">Home</button></Link>
                <Link to="/historik"><button>View History</button></Link>
                
                <button onClick={() => setAuthMode('login')}>Login</button>
                <button onClick={() => setAuthMode('register')}>Register</button>
              </>
            )}
          </nav>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <Routes>
              <Route path="/" element={<Home user={user} fetchEmails={handleFetchEmails} />} />
              
              {isAuthenticated ? (
                <>
                  <Route path="/historik" element={<HistoryPage userId={user?.id} />} />
                 
                  {user?.admin && (
                    <>
                      <Route path="/admin" element={<AdminPage user={user} />} />
                      <Route path="/AllConversations" element={<AllConversations />} />
                    </>
                  )}
                </>
              ) : (
                <>
                  <Route path="/historik" element={<HistoryPage userId={null} />} />
                  
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
            </Routes>
          )}

          {showAddUserModal && (
            <div className="modal">
              <div className="modal-content">
                <button className="close" onClick={() => setShowAddUserModal(false)}>&times;</button>
                <AddUser onEmailSubmit={handleEmailSubmit} />
              </div>
            </div>
          )}

          {authMode === 'login' && (
            <div className="auth-container">
              <Login onLoginSuccess={handleLoginSuccess} onClose={() => setAuthMode(null)} />
            </div>
          )}
          
          {authMode === 'register' && (
            <div className="auth-container">
              <Register onRegisterSuccess={handleRegisterSuccess} onClose={() => setAuthMode(null)} />
            </div>
          )}

<div className="added-users-list">
  {/* Visa listan över "Added Users" endast om användaren är inloggad */}
  {isAuthenticated && (
    <>
      <h3>Added Users:</h3>
      <ul>
        {emails.length === 0 ? (
          <li>No users added yet.</li>
        ) : (
          emails.map((email, index) => <li key={index}>{email}</li>)
        )}
      </ul>
    </>
  )}
</div>
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;