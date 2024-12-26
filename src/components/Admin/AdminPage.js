import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConversations, setShowConversations] = useState(false);

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
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3001/api/get-all-conversations');
      const data = response.data;
  
      if (!data || data.length === 0) {
        setError('Inga konversationer hittades.');
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
      <h1 className="admin-page-title">Admin - Alla Konversationer</h1>

      <button onClick={handleShowConversations} className="show-conversations-button">
        {showConversations ? 'Dölj konversationer' : 'Visa konversationer'}
      </button>

      {showConversations && (
        <div className="conversation-list">
          {renderConversationList()}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
