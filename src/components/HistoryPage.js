import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistoryPage = ({ userId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funktion för att hämta användarens konversationer
  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`http://localhost:3000/get-user-conversations/${userId}`);
      setConversations(response.data);
    } catch (err) {
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
    fetchConversations(); // Hämta konversationer när komponenten laddas
  }, [userId]);

  return (
    <div className="history-page">
      <h1>Historik för konversationer</h1>

      {loading && <p>Laddar...</p>}
      {error && <p className="error">{error}</p>}

      {/* Lista över konversationer */}
      <div className="conversation-list">
        {conversations.length === 0 && !loading && <p>Inga konversationer att visa.</p>}
        {conversations.map((conversation) => (
          <div key={conversation.ConversationId} className="conversation-card">
            <h4>Datum: {conversation.Date}</h4>
            <p>Status: {conversation.Ended ? 'Avslutad' : 'Pågående'}</p>
            <ul>
              {conversation.PromptsAndAnswers.map((item, index) => (
                <li key={index}>
                  <strong>Fråga:</strong> {item.Prompt}
                  <br />
                  <strong>Svar:</strong> {item.Answer}
                  <br />
                  {item.PromptAudioURL && (
                    <audio controls src={item.PromptAudioURL}>
                      Din webbläsare stödjer inte ljuduppspelning.
                    </audio>
                  )}
                  {item.AnswerAudioURL && (
                    <audio controls src={item.AnswerAudioURL}>
                      Din webbläsare stödjer inte ljuduppspelning.
                    </audio>
                  )}
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
