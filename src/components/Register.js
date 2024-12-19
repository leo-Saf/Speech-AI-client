// Register.js
import React, { useState } from 'react';

const Register = ({ onRegisterSuccess, onClose }) => {
  const [email, setEmail] = useState(''); // State to store the email
  const [password, setPassword] = useState(''); // State to store the password
  const [message, setMessage] = useState(''); // State to store a message (success or error)
  const [isLoading, setIsLoading] = useState(false); // State to handle the loading status

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true); // Start loading

    try {
      // Making a POST request to registration API
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Sending email and password to the server
      });

      const data = await response.json(); // Parse the response JSON data

      if (!response.ok) { // If the response is not successful, throw an error
        throw new Error(data.error || 'Registration failed.');
      }

      // If registration is successful
      setMessage('Registration successful! Please log in to continue.');
      onRegisterSuccess(); // Trigger onRegisterSuccess callback

    } catch (error) {
      console.error('Registration error:', error); // Log error for debugging
      setMessage(`Error: ${error.message}`); // Set the error message
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div>
      <h1>Register</h1> {/* Main heading for registration page */}
      <form onSubmit={handleRegister}>
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
              value={password} // Bind the password state to the input
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)} // Update state with password input
              required
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Register'} {/* Display loading or register button */}
        </button>
      </form>
      <p>{message}</p> {/* Display registration success or error message */}
      <button onClick={onClose} className="close-button">Close</button> {/* Button to close the registration form */}
    </div>
  );
};

export default Register;
