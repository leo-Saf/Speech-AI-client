import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './AdminPage.css';


const AdminPage = () => {
  const [users, setUsers] = useState([]); // All users
  const [selectedUserId, setSelectedUserId] = useState(null);// Selected user ID
  const [conversations, setConversations] = useState([]); // User's conversations
  const [loading, setLoading] = useState(false); // To show loading state
  const [error, setError] = useState(null);// To handle errors
  const [showForm, setShowForm] = useState(false); // To toggle the form visibility


   // To handle user form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [admin, setAdmin] = useState(false); // Initially not an admin

  // Function to fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/get-all-users');
      setUsers(response.data); // Set all users in state
    } catch (error) {
      console.error("Error fetching users:", error);
      setError('Failed to load users');
    }
  };

  // Function to fetch user ID based on email
  const fetchUserId = async (email) => {
    try {
      const decodedEmail = decodeURIComponent(email); // Decode from URL encoding
      console.log('Decoded email:', decodedEmail); // Log for checking the email
      const response = await axios.get('/api/get-user-id', { params: { email: decodedEmail } });
      return response.data.userId;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      setError('Failed to load user ID');
    }
  };

  // Function to fetch the user's conversations
  const fetchUserConversations = async (userId) => {
    if (!userId) {
      setError('Invalid user ID');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching conversations for user ID:', userId);
      const response = await axios.get(`/api/get-user-conversations/${userId}`);


      if (response.data.message) {
        // If the message is 'No conversations found', handle it here
        if (response.data.message === 'No conversations found') {
          setConversations([]);  // Clear the conversations if none exist
          setError(null); // Clear any previous errors
        } else {
          setError(response.data.message); // Display general error messages if any
        }
      } else {
        const { singleUserConversations, multiUserConversations } = response.data;
        setConversations([...singleUserConversations, ...multiUserConversations]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  // Function to update the user
  const updateUser = async (userId, email, password, admin) => {
    try {
      setLoading(true); // Set loading status
      const response = await axios.put(`/api/update-user/${userId}`, { email, password, admin });
      alert(response.data.message);// Display response from the server (e.g., "User updated successfully.")
    } catch (error) {
      console.error("Error updating user:", error);
      setError('Failed to update user');
    } finally {
      setLoading(false); // Reset loading
    }
  };

  // Function to delete a user
  const deleteUser = async (userId) => {
    console.log("Button clicked for userId:", userId);
    const isConfirmed = window.confirm(`Are you sure you want to delete user with ID: ${userId}?`);

    if (!isConfirmed) {
      return;
    }
  
    try {
      const response = await axios.delete(`/api/delete-user/${userId}`);
      alert(response.data.message);// Display the message received from the server
      fetchAllUsers();  // Update the user list
    } catch (error) {
      console.error("Error deleting user:", error);
      setError('Failed to delete user');
    }
  };
  

  // When the component is loaded, fetch users
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // When a user is selected, fetch the user ID and their conversations
  const handleUserSelect = async (event) => {
    const email = event.target.value;
    console.log('Selected email:', email); // Log to check the email
    if (email) {
      const userId = await fetchUserId(email); // Fetch the user ID
      if (userId) {
        setSelectedUserId(userId); // Set the selected user ID
        fetchUserConversations(userId); // Fetch conversations for the user
      } else {
        setError('User ID not found');
      }
    }
  };

  // Filter function to filter conversations based on date
  const filterConversationsByDateRange = (conversationsList) => {
    const startDate = new Date('2024-01-01'); // Start date for filtering
    const endDate = new Date('2024-12-31'); // End date for filtering
    
    return conversationsList.filter(conversation => {
      const conversationDate = new Date(conversation.Date);
      return conversationDate >= startDate && conversationDate <= endDate;
    });
  };

  // Render the conversations in a list with filtering based on date
  const renderConversationList = (conversationsList) => {
    const filteredConversations = filterConversationsByDateRange(conversationsList);

    return filteredConversations.map((conversation) => (
      <div key={conversation.ConversationId} className="conversation-card">
        <h4>Date: {conversation.Date}</h4>
        <p>Status: {conversation.Ended ? 'Completed' : 'Ongoing'}</p>
        <ul>
          {Array.isArray(conversation.PromptsAndAnswers) && conversation.PromptsAndAnswers.length > 0 ? (
            conversation.PromptsAndAnswers.map((item, index) => (
              <li key={index}>
                <strong>Question:</strong> {item?.Prompt || 'No question'}
                <br />
                <strong>Answer:</strong> {item?.Answer || 'No answer'}
              </li>
            ))
          ) : (
            <p>No questions or answers available.</p>
          )}
        </ul>
      </div>
    ));
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>

      {/* Dropdown to select a user  */}
      <div>
        <label>Select a user:</label>
        <select onChange={handleUserSelect}>
          <option value="">-- Select a user --</option>
          {users.map((user) => (
            <option key={user.Email} value={user.Email}>
              {user.Email} - {user.id}
            </option>
          ))}
        </select>
      </div>

      {/* Knappar: Update, Delete (Dropdown), All User Conversations */}
      <div className="admin-buttons">
        <button onClick={() => setShowForm(!showForm)}>Update User</button>

        {/* Dropdown to select a user to delete*/}
<select
  className="delete-user-select" 
  onChange={async (e) => {
    const userId = await fetchUserId(e.target.value); // Fetch ID based on email
    if (userId) {
      deleteUser(userId); // Run delete if ID is valid
    } else {
      console.error("Could not find user ID for email:", e.target.value);
    }
  }}
>
  <option value="">-- Select user to delete --</option>
  {users.map((user) => (
    <option key={user.Email} value={user.Email}>
      {user.Email} - {user.id}
    </option>
  ))}
</select>


        {/* All User Conversations Button */}
        <Link to="/AllConversations">
          <button>All User Conversations</button>
        </Link>
      </div>

      {/* Show form to update user if the Update button is clicked */}
      {showForm && selectedUserId && (
        <div className="update-user-form">
          <h2>Update User Info</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent page reload on form submit
              updateUser(selectedUserId, email, password, admin); // Update user
            }}
          >
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Set email
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Set password
              />
            </label>
            <label>
              Admin:
              <select
                value={admin}
                onChange={(e) => setAdmin(e.target.value === "true")} // Set admin status
              >
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </label>
            <button type="submit">Update User</button>
          </form>
        </div>
      )}

      {/* Handle loading or errors */}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/*Show conversations */}
      {conversations.length === 0 && !loading && !error && (
        <p>No conversations available for this user.</p>
      )}
      {conversations.length > 0 && !error && (
        <div>
          <h2>Conversations for {selectedUserId}</h2>
          {/* renderConversationList() will display the user's conversations */}
          {renderConversationList(conversations)}
        </div>
      )}

      
    </div>
  );
};

export default AdminPage;