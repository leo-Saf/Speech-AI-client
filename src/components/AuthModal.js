// AuthModal.js
import React from 'react';
import Login from './Login';
import Signup from './Signup';

const AuthModal = ({ mode, onClose, onLoginSuccess }) => {
  return (
    <div className="overlay">
      <div className="modal">
        {mode === 'login' ? (
          <Login onClose={onClose} onLoginSuccess={onLoginSuccess} /> // Skicka vidare prop
        ) : (
          <Signup onClose={onClose} />
        )}
        <button onClick={onClose}>Stäng</button>
      </div>
    </div>
  );
};

export default AuthModal;
