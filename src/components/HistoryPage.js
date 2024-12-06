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

      // Hämta data från API
      const response = await axios.get(`/get-user-conversations/${userId}`);
      const data = response.data;

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
        setError('Ett fel uppstod vid hämtning av konversationer.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  return (
    <div className="history-page">
      <h1>Historik för konversationer</h1>

      {loading && <p>Laddar...</p>}
      {error && <p className="error">{error}</p>}

      <div className="conversation-list">
        {!loading &&
          conversations.singleUserConversations.length === 0 &&
          conversations.multiUserConversations.length === 0 && (
            <p>Inga konversationer att visa.</p>
          )}

        {conversations.singleUserConversations.map((conversation) => (
          <div key={conversation.ConversationId} className="conversation-card">
            <h4>Datum: {conversation.Date}</h4>
            <p>Status: {conversation.Ended ? 'Avslutad' : 'Pågående'}</p>
            <ul>
              {conversation.PromptsAndAnswers.map((item, index) => (
                <li key={index}>
                  <strong>Fråga:</strong> {item.Prompt}
                  <br />
                  <strong>Svar:</strong> {item.Answer}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {conversations.multiUserConversations.map((conversation) => (
          <div key={conversation.ConversationId} className="conversation-card">
            <h4>Datum: {conversation.Date}</h4>
            <p>Status: {conversation.Ended ? 'Avslutad' : 'Pågående'}</p>
            <ul>
              {conversation.PromptsAndAnswers.map((item, index) => (
                <li key={index}>
                  <strong>Fråga:</strong> {item.Prompt}
                  <br />
                  <strong>Svar:</strong> {item.Answer}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
