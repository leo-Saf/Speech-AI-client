import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style.css';

const HistoryPage = ({ userId }) => {
  const [conversations, setConversations] = useState({ singleUserConversations: [], multiUserConversations: [] });
  const [analysis, setAnalysis] = useState({});
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Hämta data från API
      const response = await axios.get(`/get-user-conversations/${userId}`);
      const data = response.data;

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

  const fetchAnalysis = async () => {
    try {
      setAnalysisLoading(true);
      setAnalysisError(null);

      // Hämta analysdata från API
      const response = await axios.get(`/api/analysis`);
      const { sections, wordCount } = response.data; // Destrukturera det mottagna objektet

      // Bygg analysobjektet baserat på sections-arrayen
      const analysisData = {
        vocabularyRichness: sections[0] || 'Ingen data tillgänglig.',
        grammarMistakes: sections[1] || 'Ingen data tillgänglig.',
        improvements: sections[2] || 'Ingen data tillgänglig.',
        fillerWords: sections[3] || 'Ingen data tillgänglig.',
        summary: sections[4] || 'Ingen data tillgänglig.',
        wordCount: wordCount || 0,
      };

      setAnalysis(analysisData);


    } catch (err) {
      console.error(err);
      setAnalysisError('Ett fel uppstod vid hämtning av analysdata.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchAnalysis();
  }, [userId]);

  return (
<div className="history-analysis-page">
  <div className="history-section">
    <h1>Konversationshistorik</h1>
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
    </div>
  </div>

  <div className="analysis-section">
    <h1>Textanalys</h1>
    {analysisLoading && <p>Laddar analys...</p>}
    {analysisError && <p className="error">{analysisError}</p>}

    {!analysisLoading && !analysisError && (
      <div className="analysis-grid">
        <div className="analysis-card">
          <h2>Ordförrådets rikedom</h2>
          <p>{analysis.vocabularyRichness || 'Ingen data tillgänglig.'}</p>
        </div>
        <div className="analysis-card">
          <h2>Grammatiska fel</h2>
          <p>{analysis.grammarMistakes || 'Ingen data tillgänglig.'}</p>
        </div>
        <div className="analysis-card">
          <h2>Förbättringar</h2>
          <p>{analysis.improvements || 'Ingen data tillgänglig.'}</p>
        </div>
        <div className="analysis-card">
          <h2>Fyllnadsord</h2>
          <p>{analysis.fillerWords || 'Ingen data tillgänglig.'}</p>
        </div>
        <div className="analysis-card summary-card">
          <h2>Sammanfattning</h2>
          <p>{analysis.summary || 'Ingen data tillgänglig.'}</p>
        </div>
      </div>
    )}
  </div>
</div>

  );
};

export default HistoryPage;
