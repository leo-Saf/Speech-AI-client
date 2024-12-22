import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]); // Lägg till state för användare
  const [selectedUser, setSelectedUser] = useState(""); // State för vald användare
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sanera email (ersätta punkter med understreck för Firebase)
  const sanitizeEmail = (email) => {
    return email.replace(/\./g, '_'); 
};


  // Hämta konversationer för en specifik användare
  const fetchUserConversations = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const sanitizedUserId = sanitizeEmail(userId); // Sanera e-postadressen här
      const response = await axios.get(`http://localhost:3001/api/get-user-conversations/${userId}`);
      const { singleUserConversations, multiUserConversations } = response.data;
      if (!singleUserConversations?.length && !multiUserConversations?.length) {
        setError('Inga konversationer hittades.');
      } else {
        setConversations([...singleUserConversations, ...multiUserConversations]);
      }
    } catch (err) {
      console.error('Fel vid hämtning av konversationer:', err);
      setError('Ett fel inträffade vid hämtning av konversationer.');
    } finally {
      setLoading(false);
    }
  };

  // Hämta alla användare
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/get-all-users');
      setUsers(response.data);
    } catch (err) {
      console.error('Fel vid hämtning av användare:', err);
      setError('Ett fel inträffade vid hämtning av användare.');
    }
  };

  // Hämta alla konversationer (kan vara användbart för admin-sida)
  const fetchAllConversations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/get-all-conversations');
      setConversations(response.data);
    } catch (err) {
      console.error('Fel vid hämtning av konversationer:', err);
      setError('Ett fel inträffade vid hämtning av konversationer.');
    }
  };

  // Använd useEffect för att både hämta användare och konversationer
  useEffect(() => {
    fetchUsers();
    if (selectedUser) {
      fetchUserConversations(selectedUser); // Hämta konversationer för vald användare
    } else {
      fetchAllConversations(); // Hämta alla konversationer om ingen användare är vald
    }
  }, [selectedUser]);

  const renderConversationList = () => {
    if (loading) return <p className="loading-text">Laddar...</p>;
    if (error) return <p className="error-text">{error}</p>;

    if (conversations.length === 0) return <p>Inga konversationer tillgängliga.</p>;

    return conversations.map((conversation) => (
      <div key={conversation.ConversationId} className="conversation-card">
        <h4 className="conversation-title">Datum: {conversation.Date}</h4>
        <p className={`conversation-status ${conversation.Ended ? 'ended' : 'ongoing'}`}>
          Status: {conversation.Ended ? 'Avslutad' : 'Pågående'}
        </p>
        <ul className="prompts-and-answers">
          {conversation.PromptsAndAnswers?.length > 0 ? (
            conversation.PromptsAndAnswers.map((item, index) => (
              <li key={item?.Prompt || index}>
                <strong>Fråga:</strong> {item?.Prompt || 'Ingen fråga'} <br />
                <strong>Svar:</strong> {item?.Answer || 'Inget svar'}
              </li>
            ))
          ) : (
            <p>Inga frågor eller svar tillgängliga.</p>
          )}
        </ul>
        <div className="conversation-users">
          <strong>Användare:</strong> {conversation.Users?.join(', ') || 'Ingen användare'}
        </div>
      </div>
    ));
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Admin - Konversationer</h1>

      {/* Dropdown-lista för användare */}
      <div className="user-dropdown">
        <label htmlFor="users">Välj en användare:</label>
        <select
          id="users"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Välj en användare --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.Email} {/* Visa användarens e-post */}
            </option>
          ))}
        </select>
      </div>

      <div className="conversation-list">{renderConversationList()}</div>
    </div>
  );
};

export default AdminPage;
