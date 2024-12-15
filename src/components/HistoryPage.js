import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style.css';

const HistoryPage = ({ userId }) => {
  const [conversations, setConversations] = useState({ singleUserConversations: [], multiUserConversations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Hantera om inget userId tillhandahålls (dvs gäst)
    const userIdentifier = userId || ' '; // Om användar-ID är null, sätt till 'guest'

      // Hämta data från API
      const response = await axios.get(`http://localhost:3000/get-user-conversations/${userId}`);
      const data = response.data;
      if (!data) {
        console.error("Inget svar från servern");
        setError('Ett problem uppstod med att hämta konversationer.');
        return;
      }

      
      // Säkerställ att data är i rätt format
      setConversations({
        singleUserConversations: data.singleUserConversations || [],
        multiUserConversations: data.multiUserConversations || [],
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setError('Inga konversationer hittades.');
      } else {
        console.error('Fel vid hämtning av konversationer:', error);
        setError('Ett fel uppstod vid hämtning av konversationer.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  console.log("Användar-ID som skickas:", userId);
  
  // Om inget userId finns (dvs gäst), sätt det till 'guest' för att hämta konversationerna för gäst.
  fetchConversations();
}, [userId]); // Körs om userId ändras


  // Renderar en lista med konversationer (både enkel- och fleranvändare)
const renderConversationList = (conversationsList) => {
  return conversationsList.map((conversation) => (
    <div key={conversation.ConversationId} className="conversation-card">
      <h4>Datum: {conversation.Date}</h4>
      <p>Status: {conversation.Ended ? 'Avslutad' : 'Pågående'}</p>
      <ul>
        {Array.isArray(conversation.PromptsAndAnswers) && conversation.PromptsAndAnswers.length > 0 ? (
          conversation.PromptsAndAnswers.map((item, index) => (
            <li key={index}>
              <strong>Fråga:</strong> {item?.Prompt || 'Ingen fråga'}
              <br />
              <strong>Svar:</strong> {item?.Answer || 'Inget svar'}
            </li>
          ))
        ) : (
          <p>Inga frågor och svar tillgängliga.</p>
        )}
      </ul>
    </div>
  ));
};


  return (
    <div className="history-page">
  <h1>Historik för konversationer</h1>

  {loading && <p>Laddar...</p>}
  {error && <p className="error">{error}</p>}

  <div className="conversation-list">
    {!loading && conversations.singleUserConversations.length === 0 && 
     conversations.multiUserConversations.length === 0 && (
      <p>Inga konversationer att visa.</p>
    )}

    {/* Enkelanvändarkonversationer */}
    {conversations.singleUserConversations.length > 0 && (
      <>
        <h2>Enkelanvändarkonversationer</h2>
        {renderConversationList(
          conversations.singleUserConversations.sort(
            (a, b) => new Date(b.Date) - new Date(a.Date)
          )
        )}
      </>
    )}

    {/* Fleranvändarkonversationer */}
    {conversations.multiUserConversations.length > 0 && (
      <>
        <h2>Fleranvändarkonversationer</h2>
        {renderConversationList(
          conversations.multiUserConversations.sort(
            (a, b) => new Date(b.Date) - new Date(a.Date)
          )
        )}
      </>
    )}
  </div>
</div>

  );
};

export default HistoryPage;
