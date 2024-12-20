// Login.js
import React, { useState } from 'react';

const Login = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState(''); // State to store the email
  const [password, setPassword] = useState(''); // State to store the password
  const [message, setMessage] = useState(''); // State to store a message (success or error)
  const [isLoading, setIsLoading] = useState(false); // State to handle the loading status

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true); // Start loading

    try {
      // Making a POST request to login API
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Sending email and password to the server
      });

      const data = await response.json(); // Parse the response JSON data

      if (!response.ok) { // If the response is not successful, throw an error
        throw new Error(data.error || 'Login failed.');
      }

      // Check if userId exists in the response
      if (!data.userId && (!data.user || !data.user.id)) {
        throw new Error('Backend did not send user ID!');
      }

      // If login is successful
      setMessage('Login successful! Welcome back!');
      onLoginSuccess(data); // Trigger onLoginSuccess callback passing the data

      setMessage('Inloggning lyckades! Välkommen tillbaka!');
      onLoginSuccess(data);
    } catch (error) {
      console.error('Login error:', error); // Log error for debugging
      setMessage(`Error: ${error.message}`); // Set the error message
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div>
      <h1>Login</h1> {/* Main heading for login page */}
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email} // Bind the email state to the input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)} // Update state with email input
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              placeholder="Password"
              value={password} // Bind the password state to the input
              onChange={(e) => setPassword(e.target.value)} // Update state with password input
              required
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Login'} {/* Display loading or login button */}
        </button>
      </form>
      <button onClick={onClose} className="close-button">Close</button> {/* Button to close the login form */}
      <p>{message}</p> {/* Display login success or error message */}
    </div>
  );
};

export default Login;
