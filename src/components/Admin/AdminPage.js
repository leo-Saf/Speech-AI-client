import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]); // För att spara användare
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // För att hålla reda på vald användare

  // Funktion för att hämta konversationer
  const fetchAllConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3001/api/get-all-conversations');
      const data = response.data;
      if (!data || data.length === 0) {
        setError('Inga konversationer hittades.');
      } else {
        setConversations(data);
      }
    } catch (err) {
      console.error('Fel vid hämtning av konversationer:', err);
      setError('Ett fel inträffade vid hämtning av konversationer.');
    } finally {
      setLoading(false);
    }
  };

  // Funktion för att hämta alla användare
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/get-all-users'); // Uppdatera med rätt API-url för användare
      setUsers(response.data);
    } catch (err) {
      console.error('Fel vid hämtning av användare:', err);
      setError('Ett fel inträffade vid hämtning av användare.');
    }
  };

  // Hämta konversationer och användare när komponenten laddas
  useEffect(() => {
    fetchAllConversations();
    fetchAllUsers();
  }, []);

  const handleUserChange = (event) => {
    const userId = event.target.value;
    setSelectedUser(userId);
  };

  const renderConversationList = () => {
  if (loading) return <p className="loading-text">Laddar...</p>;
  if (error) return <p className="error-text">{error}</p>;

  if (conversations.length === 0) return <p>Inga konversationer tillgängliga.</p>;

  // Filtrera konversationer baserat på vald användare, om det finns någon
  const filteredConversations = selectedUser
    ? conversations.filter(conversation => Array.isArray(conversation.Users) && conversation.Users.includes(selectedUser))
    : conversations;

  return filteredConversations.map((conversation) => {
    if (conversation.UserId) {
      // För användarkonversationer
      return conversation.Conversations.map((userConversation) => (
        <div key={userConversation.ConversationId} className="conversation-card">
          <h4 className="conversation-title">Datum: {userConversation.Date}</h4>
          <p className={`conversation-status ${userConversation.Ended ? 'ended' : 'ongoing'}`}>
            Status: {userConversation.Ended ? 'Avslutad' : 'Pågående'}
          </p>
          <ul className="prompts-and-answers">
            {userConversation.PromptsAndAnswers?.length > 0 ? (
              userConversation.PromptsAndAnswers.map((item, index) => (
                <li key={item?.Prompt || index}>
                  <strong>Fråga:</strong> {item?.Prompt || 'Ingen fråga'} <br />
                  <strong>Svar:</strong> {item?.Answer || 'Inget svar'}
                </li>
              ))
            ) : (
              <p>No questions or answers available.</p>
            )}
          </ul>
          
          <div className="conversation-users">
            <strong>Användare:</strong> 
            {conversation.Users && Array.isArray(conversation.Users) ? 
              conversation.Users.map((userId) => {
                // Här kollar vi om den aktuella användaren har en e-post
                const user = conversation.Users.find((user) => user.UserId === userId);
                return user ? user.Email || 'Gäst' : 'Gäst'; 
              }).join(', ') : 'Ingen användare'}
          </div>
        </div>
      ));
    }
  });
};

  

  const renderUsersDropdown = () => {
    return (
      <div className="user-dropdown">
        <label htmlFor="users">Välj en användare:</label>
        <select id="users" onChange={handleUserChange} value={selectedUser || ''}>
          <option value="" disabled>Välj användare</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.Email}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Admin - Alla Konversationer</h1>

      {/* Dropdown för användare */}
      {renderUsersDropdown()}

      <div className="conversation-list">
        {renderConversationList()}
      </div>
    </div>
  );
};

export default AdminPage;
