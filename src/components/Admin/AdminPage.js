import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]); // Alla användare
  const [selectedUserId, setSelectedUserId] = useState(null); // Vald användar-ID
  const [conversations, setConversations] = useState([]); // Användarens konversationer
  const [loading, setLoading] = useState(false); // För att visa laddning
  const [error, setError] = useState(null); // För att hantera fel

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
      // Avkoda e-postadressen innan vi gör begäran
      const decodedEmail = decodeURIComponent(email);  // Avkoda från URL-kodning
      console.log('Decoded email:', decodedEmail);  // Logga för att kontrollera e-posten
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

      {loading && <p>Loading conversations...</p>}
      {error && <p className="error">{error}</p>}
      
      {conversations.length === 0 && !loading && !error && (
        // När det inte finns några konversationer och ingen laddning sker, håll sidan tom
        <p>No conversations available for this user.</p>
      )}
      
      {conversations.length > 0 && !error && (
        <div>
          <h2>Conversations for {selectedUserId}</h2>
          {renderConversationList(conversations)} {/* Rendera filtrerade konversationer */}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
