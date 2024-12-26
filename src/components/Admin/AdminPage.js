import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3001/api/get-all-conversations');
      const data = response.data;
      if (!data || data.length === 0) {
        setError('Inga konversationer hittades.');
      }
      setConversations(data);
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
          {conversation.PromptsAndAnswers?.map((item, index) => (
            <li key={index}>
              <strong>Fråga:</strong> {item?.Prompt || 'Ingen fråga'} <br />
              <strong>Svar:</strong> {item?.Answer || 'Inget svar'}
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Admin - Alla Konversationer</h1>

      <div className="conversation-list">
        {renderConversationList()}
      </div>
    </div>
  );
};

export default AdminPage;