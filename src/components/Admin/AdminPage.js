import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './AdminPage.css';


const AdminPage = () => {
<<<<<<< Updated upstream
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConversations, setShowConversations] = useState(false);
=======
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
>>>>>>> Stashed changes

  // Funktion för att hämta konversationer
  const fetchUserEmail = async (userId) => {
    // Kolla om userId är en gäst och hantera det separat
  if (userId.startsWith('Guest-')) {
    return `${userId}`;  // Returnera en standard e-postadress för gäster
  }
    try {
      const response = await axios.get(`http://localhost:3001/api/get-user/${userId}`);
      return response.data.Email || userId; // Om Email saknas, returnera UserId
    } catch (error) {
      console.error(`Fel vid hämtning av e-post för UserID: ${userId}`, error);
      return userId; // Returnera UserId om det inte går att hämta data
    }
  };
  
  
  const fetchAllConversations = async () => {
    try {
<<<<<<< Updated upstream
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3001/api/get-all-conversations');
      const data = response.data;
  
      if (!data || data.length === 0) {
        setError('Inga konversationer hittades.');
=======
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
>>>>>>> Stashed changes
      } else {
        // Lägg till e-post i varje användare
        const conversationsWithEmails = await Promise.all(
          data.map(async (conversation) => {
            if (!conversation.UserId) {
              console.warn('UserId saknas för en konversation:', conversation);
              return { ...conversation, Email: 'Gäst - Ingen ID tillgänglig' };
            }
            const Email = await fetchUserEmail(conversation.UserId);
            return { ...conversation, Email };
          })
        );
  
        setConversations(conversationsWithEmails);
      }
    } catch (err) {
      console.error('Fel vid hämtning av konversationer:', err);
      setError('Ett fel inträffade vid hämtning av konversationer.');
    } finally {
      setLoading(false);
    }
  };
  
  

<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
  useEffect(() => {
    fetchAllConversations();
  }, []);

  // Hantera visningen av konversationer
  const handleShowConversations = () => {
    setShowConversations(!showConversations);
  };

  const renderConversationList = () => {
    if (loading) return <p className="loading-text">Laddar...</p>;
    if (error) return <p className="error-text">{error}</p>;
  
    if (!conversations || conversations.length === 0)
      return <p>Inga konversationer tillgängliga.</p>;
  
    return conversations.map((conversation) => (
      <div key={conversation.UserId || Math.random()} className="conversation-card">
        <h3>
          Användar-Identifierare:{' '}
          {conversation.Email === conversation.UserId
            ? `: ${conversation.UserId}`
            : conversation.Email}
        </h3>
        {conversation.Conversations && conversation.Conversations.length > 0 ? (
          conversation.Conversations.map((userConversation) => (
            <div
              key={userConversation.ConversationId || Math.random()}
              className="conversation-details"
            >
              <h4>Datum: {userConversation.Date || 'Okänt datum'}</h4>
              <p>
                Status: {userConversation.Ended ? 'Avslutad' : 'Pågående'}
              </p>
              <ul>
                {userConversation.PromptsAndAnswers &&
                userConversation.PromptsAndAnswers.length > 0 ? (
                  userConversation.PromptsAndAnswers.map((item, index) => (
                    <li key={index}>
                      <strong>Fråga:</strong> {item?.Prompt || 'Ingen fråga'} <br />
                      <strong>Svar:</strong> {item?.Answer || 'Inget svar'}
                    </li>
                  ))
                ) : (
                  <p>Inga frågor eller svar tillgängliga.</p>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>Inga konversationer för denna användare.</p>
        )}
      </div>
    ));
  };
  
  

  return (
    <div className="admin-page">
<<<<<<< Updated upstream
      <h1 className="admin-page-title">Admin - Alla Konversationer</h1>

      <button onClick={handleShowConversations} className="show-conversations-button">
        {showConversations ? 'Dölj konversationer' : 'Visa konversationer'}
      </button>

      {showConversations && (
        <div className="conversation-list">
          {renderConversationList()}
=======
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
>>>>>>> Stashed changes
        </div>
      )}

      
    </div>
  );
};

export default AdminPage;