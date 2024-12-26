import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import HistoryPage from './components/HistoryPage';
import AudioUploader from './components/AudioUploader';
import AdminPage from './components/Admin/AdminPage'; 
import Register from './components/Register';
import Login from './components/Login';
import AddUser from './components/AddUser';

import { toast, ToastContainer } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Toast container styles
import './style.css'; // Custom styles

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);  // State to track if the user is authenticated
  const [user, setUser] = useState(null); // State to store the authenticated user's information
  const [authMode, setAuthMode] = useState(null); // State to control which modal (Login/Register) should be shown
  const [emails, setEmails] = useState([]); // State to store an array of emails
  const [showAddUserModal, setShowAddUserModal] = useState(false); // State to control modal visibility

  const handleFetchAndResetEmails = () => {
    const currentEmails = [...emails]; // Clone the emails
    setEmails([]); // Reset the emails array
    return currentEmails;
  };

  // Function to handle the email passed from AddUser
  const handleEmailSubmit = (email) => {
    console.log('Email received by App.js: ', email);
    setEmails((prevEmails) => {
      // Debugging: Log the current state of the emails array
      console.log('Previous emails array:', prevEmails);
  
      const updatedEmails = [...prevEmails, email]; // Add the new email
      console.log('Updated emails array:', updatedEmails); // Log the updated array
  
      return updatedEmails; // Update the state
    });
    toast.success('User added: ' + email); // Optional: Notify the user
  };

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

  return (
    <Router>
      
      
      <div>
        <ToastContainer position="top-center" autoClose={3000} />
        <nav className="auth-buttons">
           {/* If the user is authenticated */}
          {isAuthenticated ? (
            <>
            
              <span>Welcome, {user ? user.Email : 'User'}</span>
               {/* Button for home page */}
              <Link to="/">
             <button className="home-button">Home</button> 
             </Link>
              <button className="Logout" onClick={handleLogout}>
                Logga ut
              </button>
              <Link to="/historik">
                <button>View History</button>
                
              </Link>
              <Link to="/Recording">
                <button>Recording</button>
              </Link>
              <button onClick={() => setShowAddUserModal(true)}>Add User</button> 
              {/* Show Admin page link if the user is an admin */}
              {user?.admin && ( 
                <Link to="/admin">
                  <button className="admin-button">Admin Page</button>
                </Link>
              )}
            </>
          ) : (

            // If the user is not authenticated
            <>
              <span>You are a guest.</span>
              <Link to="/historik">
            <button>View History</button>
          </Link>
          <Link to="/">
             <button className="home-button">Home</button> 
             </Link>
              <button onClick={() => setAuthMode('login')}>Logga in</button>
              <button onClick={() => setAuthMode('register')}>Registrera</button>
              
          
          
            </>
          )}
        </nav>

        <Routes>
   {/* Routes for authenticated users */}
  {isAuthenticated ? (
    <>
      <Route
        path="/historik"
        element={<HistoryPage userId={user?.id} />}
      />
      
      <Route
        path="/Recording"
        element={
          <>
            {/* Debugging log to see if the function is passed correctly */}
            {console.log("user:", user?.i)}
            {console.log("fetchAndResetEmails function passed:", handleFetchAndResetEmails)}
            <AudioUploader
              userId={user?.id}
              fetchAndResetEmails={handleFetchAndResetEmails} // function is passed here
            />
          </>
                }
      />
      {user?.admin && ( // Admin-specifik rutt
                <Route path="/admin" element={<AdminPage />} />
              )}
    </>
  ) : (
   // Routes for guests (unauthenticated users)
    <>
      <Route
        path="/historik"
        element={<HistoryPage userId={null} />} // Pass null for guest on history page
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

   {/* Default homepage route */}
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



        {/* Show modals for Login/Registration only when a button is clicked */}
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