import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../style.css'; // Använd CSS för modal

const Login = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
<<<<<<< Updated upstream
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Inloggad');
      onLoginSuccess(); // Notifiera om lyckad inloggning
      onClose(); // Stäng modalen efter inloggning
    } catch (err) {
      setError(err.message); // Sätt felmeddelande om inloggning misslyckas
=======
    setIsLoading(true);

    console.log("Data som skickas till backend:", { email, password });

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Inloggning misslyckades.');
      }
      
      if (!data.userId) {
        throw new Error('Användar-ID saknas i backend-responsen.');
      }

      setMessage('Inloggning lyckades! Välkommen tillbaka!');
      onLoginSuccess(data);
    } catch (error) {
      console.error('Fel vid inloggning:', error);
      setMessage(`Fel: ${error.message}`);
    } finally {
      setIsLoading(false);
>>>>>>> Stashed changes
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
        <button type="submit">Logga in</button>
      </form>
      {error && <p>{error}</p>} {/* Visa felmeddelande om det finns */}
    </div>
  );
};

export default Login;
