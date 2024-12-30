import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import HistoryPage from './components/HistoryPage';
import AudioUploader  from './components/AudioUploader';
import Register from './components/Register';
import Login from './components/Login';
<<<<<<< Updated upstream

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
<<<<<<< Updated upstream
    console.log('Användardata från backend:', userData); // Logga användardata
<<<<<<< Updated upstream
    if (userData && userData.userId) {
      setIsAuthenticated(true);
      setUser(userData); // Sparar hela användardata inklusive userId
      setAuthMode(null); // Stänger modalen
      toast.success(`Inloggning lyckades! Välkommen, ${userData.email}`);
    } else {
      toast.error('Inloggning misslyckades! Ingen användar-ID hittades.');
=======
    
    // Kontrollera alternativa strukturer
=======
    console.log('Användardata från backend:', userData);
>>>>>>> Stashed changes
=======
import AddUser from './components/AddUser';

import { AllConversations } from './components/Admin/AllConversations';
import { toast, ToastContainer } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Toast container styles
import './styling.css'; // Custom styles

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);  // State to track if the user is authenticated
  const [user, setUser] = useState(null); // State to store the authenticated user's information
  const [authMode, setAuthMode] = useState(null); // State to control which modal (Login/Register) should be shown
  const [emails, setEmails] = useState([]); // State to store an array of emails
  const [showAddUserModal, setShowAddUserModal] = useState(false); // State to control modal visibility

  React.useEffect(() => {
    console.log('--------------------------- NEW EMAIL LOGS ----------------------------');
    console.log('Emails state updated:', emails);
  }, [emails]);

  const handleFetchEmails = () => {
    console.log('Fetching emails...');
    const currentEmails = [...emails]; // Clone the current emails array
    console.log('Fetched emails:', currentEmails);
    return currentEmails; // Return the fetched emails
  };
  
  const handleResetEmails = () => {
    console.log('Resetting emails...');
    setEmails([]); // Clear the emails state
    console.log('Emails have been reset.');
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
>>>>>>> Stashed changes
    if (userData?.userId) {
      // If login is successful, update the authentication state and user data
      setIsAuthenticated(true);
      setUser({
        id: userData.userId,
        email: userData.Email,
        admin: userData.Admin, // Store admin status for later use
      });
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      console.log("Inloggning lyckades. User state:", {
        id: userData.userId,
        email: userData.Email,
      });
    setAuthMode(null); // Stänger modalen
    toast.success('Inloggning lyckades! Välkommen.');
>>>>>>> Stashed changes
    }
<<<<<<< Updated upstream
=======
   else {
    toast.error('Inloggning misslyckades! Ingen användar-ID hittades.');
    console.error('Användardata saknar userId:', userData)
   }
>>>>>>> Stashed changes
=======
      setAuthMode(null); // Stänger modalen
      toast.success('Inloggning lyckades! Välkommen.');
    } else {
      toast.error('Inloggning misslyckades! Ingen användar-ID hittades.');
    }
>>>>>>> Stashed changes
  };

  // Hantering av utloggning
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    toast.info('Du har loggat ut.');
=======
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
>>>>>>> Stashed changes
  };

  return (
    <Router>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      
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
            </>
          ) : (
            <>
              <span>Du är som gäst.</span>
              <Link to="/historik">
            <button>Visa Historik</button>
          </Link>
          
              <button onClick={() => setAuthMode('login')}>Logga in</button>
              <button onClick={() => setAuthMode('register')}>Registrera</button>
=======
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
              <Route path="/historik" element={<HistoryPage userId={user?.id } />} />
              <Route path="/inspelning" element={<AudioUploader userId={user?.id} />} />
            </>
          ) : (
            <>
              <Route path="/historik" element={<HistoryPage userId={null} />} />
              <Route
                path="*"
                element={
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <h2>Du måste logga in för att komma åt denna sida.</h2>
                    <button onClick={() => setAuthMode('login')}>Logga in</button>
                  </div>
                }
              />
>>>>>>> Stashed changes
            </>
          )}
        </Routes>

<<<<<<< Updated upstream
        <Routes>
<<<<<<< Updated upstream
          {isAuthenticated ? (
            <>
              <Route path="/historik" element={<HistoryPage userId={user?.id} />} />
              <Route path="/inspelning" element={<AudioUploader userId={user?.id}/>} />
            </>
          ) : (
=======
  {/* För inloggade användare */}
  {isAuthenticated ? (
    <>
      <Route
        path="/historik"
        element={<HistoryPage userId={user?.id || null} />}
      />
      <Route
        path="/inspelning"
        element={<AudioUploader userId={user?.id || null} />}
      />
    </>
  ) : (
    /* För gäster */
    <>
      <Route
        path="/historik"
        element={<HistoryPage userId={null} />} // Passa null för gäst
      />
>>>>>>> Stashed changes
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
          <Route path="/" element={<Home userId={user?.id} />} />
        </Routes>

        {/* Rendera modal för inloggning/registrering endast när en knapp trycks */}
=======
        {/* Modal för autentisering */}
>>>>>>> Stashed changes
=======
      <div>
        <ToastContainer position="top-center" autoClose={3000} />
        <nav className="auth-buttons">
        <h1 className="site-title">Speech AI</h1>
           {/* If the user is authenticated */}
          {isAuthenticated ? (
            <>
            
              <span className="span">Welcome {user ? user.email : 'User'}</span>
               {/* Button for home page */}
              <Link to="/">
             <button className="home-button">Home</button> 
             </Link>
              
              <Link to="/historik">
                <button>View History</button>
                
              </Link>
              <Link to="/Recording">
                <button>Recording</button>
              </Link>
              <button onClick={() => setShowAddUserModal(true)}>Add User</button> 
              <button className="Logout" onClick={handleLogout}>
              Logout
              </button>
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
            <AudioUploader
              userId={user?.id}
              fetchEmails={handleFetchEmails} // ................... FUNCTION IS PASSED HERE 
              resetEmails={handleResetEmails} // ................... FUNCTION IS PASSED HERE 
            />
          </>
                }
      />
      {user?.admin && (
      <>
        {/* Admin-specific route for Admin Page */}
        <Route path="/admin" element={<AdminPage user={user} />} />
        
        {/* Admin-specific route for User Conversations */}
        <Route
          path="/AllConversations"
          element={<AllConversations />} // Replace with your component
        />
         </>
    )}
    </>  
  ) : (
   // Routes for guests (unauthenticated users)
    <>
      <Route
        path="/historik"
        element={
        <HistoryPage userId={null} />} // Pass null for guest on history page
      />
      <Route
        path="/Recording"
        element={
              <AudioUploader userId={null} />
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
        
        {/* Display the list of emails under "Lägg till" button */}
        <div className="added-users-list">
          <h3>Added Users:</h3>
          <ul>{
            emails.length === 0 ? (
            <li>No users added yet.</li>
            ) : (
            emails.map((email, index) => (
            <li key={index}>{email}</li>
            ))
          )}
          </ul>
        </div>
>>>>>>> Stashed changes
      </div>
    </Router>
  );
};

export default App;
