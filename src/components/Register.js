import React, { useState } from 'react';

const Register = ({ onRegisterSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registrering misslyckades.');
      }

      setMessage('Registrering lyckades! Logga in för att fortsätta.');
      onRegisterSuccess();
    } catch (error) {
      console.error('Fel vid registrering:', error);
      setMessage(`Fel: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Registrera</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Lösenord:
            <input
              type="password"
              value={password}
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Laddar...' : 'Registrera'}
        </button>
      </form>
      <p>{message}</p>
      <button onClick={onClose} className="close-button">Stäng</button>
    </div>
  );
};

export default Register;
