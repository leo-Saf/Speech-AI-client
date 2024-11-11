import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../style.css';

const Login = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Enkel validering av email och lösenord
    if (!email || !password) {
      setError("Vänligen fyll i både e-post och lösenord.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Inloggad');
      onLoginSuccess(); // Notifiera om lyckad inloggning
      onClose(); // Stäng modalen efter inloggning
    } catch (err) {
      setError("Fel vid inloggning: " + err.message); // Visa mer användarvänligt felmeddelande
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Logga in</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit" disabled={loading}>
          {loading ? "Loggar in..." : "Logga in"}
        </button>
      </form>
      {error && <p>{error}</p>} {/* Visa felmeddelande om det finns */}
    </div>
  );
};

export default Login;
