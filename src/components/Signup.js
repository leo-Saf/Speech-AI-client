import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import '../style.css';

const Signup = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Användare skapad');
      onClose(); // Stäng modalen efter registrering
    } catch (err) {
      setError(err.message); // Visa felmeddelande om registrering misslyckas
    }
  };

  return (
    <div>
      <h2>Skapa konto</h2>
      <form onSubmit={handleSignup}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Lösenord" 
        />
        <button type="submit">Registrera</button>
      </form>
      {error && <p>{error}</p>} {/* Visa felmeddelande om det finns */}
    </div>
  );
};

export default Signup;
