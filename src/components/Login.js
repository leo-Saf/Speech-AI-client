import React, { useState } from 'react';

const Login = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Inloggning misslyckades.');
      }

      // Kontrollera att userId finns i svaret
      if (!data.userId && (!data.user || !data.user.id)) {
        throw new Error('Backend skickade inte användar-ID!');
      }
      


      setMessage('Inloggning lyckades! Välkommen tillbaka!');
      onLoginSuccess(data);
    } catch (error) {
      console.error('Fel vid inloggning:', error);
      setMessage(`Fel: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Logga in</h1>
      <form onSubmit={handleLogin}>
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Laddar...' : 'Logga in'}
        </button>
      </form>
      <button onClick={onClose} className="close-button">Stäng</button>
      <p>{message}</p>
    </div>
  );
};

export default Login;