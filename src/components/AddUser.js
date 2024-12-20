import React, { useState } from 'react';

const AddUser = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();  // Prevent form submission from reloading the page
    setIsLoading(true);

    try {
      // api
      /*const response = await fetch('http://localhost:3000/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });*/

      //const data = await response.json();

      /*if (!response.ok) {
        throw new Error(data.error || 'Could not add user');
      }*/

      // On success, pass the email back to the parent component
      onEmailSubmit(email);  // Send the email back to the parent (App.js)

      setMessage('User added successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New User</h1>
      <form onSubmit={handleAddUser}>
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding User...' : 'Lägg till'}
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default AddUser;
