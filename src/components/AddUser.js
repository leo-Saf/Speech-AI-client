import React, { useState } from 'react';

// Funktion för att lägga till användarens email till konversationen eller sessionen
const AddUser = ({ onEmailSubmit, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();  // Förhindrar formulärsändning som laddar om sidan
    setIsLoading(true);
    // Simulera API-anrop
    setTimeout(() => {
      setIsLoading(false);
      setMessage('User added successfully!');
    }, 2000);
  

    try {
      // API-anrop, kan fyllas i senare
      /*const response = await fetch('http://localhost:3000/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });*/

      //const data = await response.json();

      /*if (!response.ok) {
        throw new Error(data.error || 'Could not add user');
      }*/

      // Vid lyckad tillägg, skicka email tillbaka till föräldrakomponenten
      console.log('NEW EMAIL: ', email);
      onEmailSubmit(email);  // Skicka email till föräldern (App.js)

      setMessage('User added successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
      <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h1>Add New User</h1>
        <form onSubmit={handleAddUser}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="Enter user's email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Adding User...' : 'Add User'}
          </button>
        </form>
        {message && <p className={`message ${isLoading ? 'loading' : ''}`}>{message}</p>}
      </div>
    </div>
  );
};

export default AddUser;