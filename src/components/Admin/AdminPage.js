import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './AdminPage.css';


const AdminPage = () => {
  const [users, setUsers] = useState([]); // Alla användare
  const [selectedUserId, setSelectedUserId] = useState(null); // Vald användar-ID
  const [conversations, setConversations] = useState([]); // Användarens konversationer
  const [loading, setLoading] = useState(false); // För att visa laddning
  const [error, setError] = useState(null); // För att hantera fel
  const [showForm, setShowForm] = useState(false);


  // För att hantera användarens formdata
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [admin, setAdmin] = useState(false); // Initialt icke-admin

  // Funktion för att hämta alla användare
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/get-all-users');
      setUsers(response.data); // Sätt alla användare i state
    } catch (error) {
      console.error("Error fetching users:", error);
      setError('Failed to load users');
    }
  };

  // Funktion för att hämta användarens ID baserat på e-post
  const fetchUserId = async (email) => {
    try {
      const decodedEmail = decodeURIComponent(email); // Avkoda från URL-kodning
      console.log('Decoded email:', decodedEmail); // Logga för att kontrollera e-posten
      const response = await axios.get('/api/get-user-id', { params: { email: decodedEmail } });
      return response.data.userId;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      setError('Failed to load user ID');
    }
  };

  // Funktion för att hämta användarens konversationer
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
        // Om meddelandet är 'No conversations found', hantera det här
        if (response.data.message === 'No conversations found') {
          setConversations([]);  // Rensa konversationerna om det inte finns några
          setError(null);  // Rensa eventuella gamla fel
        } else {
          setError(response.data.message);  // Visa generella felmeddelanden om de finns
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

  // Funktion för att uppdatera användaren
  const updateUser = async (userId, email, password, admin) => {
    try {
      setLoading(true); // Sätt laddningsstatus
      const response = await axios.put(`/api/update-user/${userId}`, { email, password, admin });
      alert(response.data.message); // Visa svar från servern (t.ex. "User updated successfully.")
    } catch (error) {
      console.error("Error updating user:", error);
      setError('Failed to update user');
    } finally {
      setLoading(false); // Återställ laddning
    }
  };

  const deleteUser = async (userId) => {
    console.log("Button clicked for userId:", userId);
    const isConfirmed = window.confirm(`Are you sure you want to delete user with ID: ${userId}?`);

    if (!isConfirmed) {
      return;
    }
  
    try {
      const response = await axios.delete(`/api/delete-user/${userId}`);
      alert(response.data.message); // Visa meddelandet som vi får från servern
      fetchAllUsers(); // Uppdatera användarlistan
    } catch (error) {
      console.error("Error deleting user:", error);
      setError('Failed to delete user');
    }
  };
  

  // När komponenten har laddats, hämta användare
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // När en användare är vald, hämta användar-ID och deras konversationer
  const handleUserSelect = async (event) => {
    const email = event.target.value;
    console.log('Selected email:', email); // Logga för att kontrollera e-posten
    if (email) {
      const userId = await fetchUserId(email); // Hämta användarens ID
      if (userId) {
        setSelectedUserId(userId); // Sätt valt användar-ID
        fetchUserConversations(userId); // Hämta konversationer för användaren
      } else {
        setError('User ID not found');
      }
    }
  };

  // Filterfunktion för att filtrera konversationer baserat på datum
  const filterConversationsByDateRange = (conversationsList) => {
    const startDate = new Date('2024-01-01'); // Startdatum för filtrering
    const endDate = new Date('2024-12-31'); // Slutdatum för filtrering
    
    return conversationsList.filter(conversation => {
      const conversationDate = new Date(conversation.Date);
      return conversationDate >= startDate && conversationDate <= endDate;
    });
  };

  // Rendera konversationerna i en lista med filtrering baserat på datum
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

      {/* Dropdown för att välja användare */}
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
        <button onClick={() => setShowForm(!showForm)}>Update</button>

        {/* Dropdown för att välja användare att radera */}
<select
  className="delete-user-select" // Lägg till en klass för att styla den
  onChange={async (e) => {
    const userId = await fetchUserId(e.target.value); // Hämta ID baserat på e-post
    if (userId) {
      deleteUser(userId); // Kör delete om ID är korrekt
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

      {/* Visa formulär för att uppdatera användare om knappen Update trycks */}
      {showForm && selectedUserId && (
        <div className="update-user-form">
          <h2>Update User Info</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Hindra sidomladdning vid formulärsändning
              updateUser(selectedUserId, email, password, admin); // Uppdatera användaren
            }}
          >
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Sätt e-post
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Sätt lösenord
              />
            </label>
            <label>
              Admin:
              <select
                value={admin}
                onChange={(e) => setAdmin(e.target.value === "true")} // Välj adminstatus
              >
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </label>
            <button type="submit">Update User</button>
          </form>
        </div>
      )}

      {/* Hantera laddning eller fel */}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Visa konversationerna */}
      {conversations.length === 0 && !loading && !error && (
        <p>No conversations available for this user.</p>
      )}
      {conversations.length > 0 && !error && (
        <div>
          <h2>Conversations for {selectedUserId}</h2>
          {/* renderConversationList() ska visa användarens konversationer */}
          {renderConversationList(conversations)}
        </div>
      )}

      
    </div>
  );
};

export default AdminPage;