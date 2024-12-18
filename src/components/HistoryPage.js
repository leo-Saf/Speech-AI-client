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
     // Hantera om inget userId tillhandahålls (dvs gäst)
     const userIdentifier = userId || ' '; // Om användar-ID är null, sätt till 'guest'

      // Hämta data från API
      const response = await axios.get(`http://localhost:3000/get-user-conversations/${userIdentifier}`);
      const data = response.data;
      if (!data) {
        console.error("Inget svar från servern");
        setError('Ett problem uppstod med att hämta konversationer.');
        return;
      }

      
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

  const fetchAnalysis = async () => {
    try {
      setAnalysisLoading(true);
      setAnalysisError(null);

      // Hämta analysdata från API
      const response = await axios.get(`/api/analysis`);
      const { sections, wordCount } = response.data; // Destrukturera det mottagna objektet

      // Remove all numbers, headers and repeting text from the beginning of section
  const cleanedSections = sections.map((section) => {
    return section
      .replace(/^\d+\.\s*/, '') // Ta bort siffror följt av punkt och mellanslag
      .trim(); // Ta bort onödiga mellanrum
  });

      // Bygg analysobjektet baserat på sections-arrayen
      const analysisData = {
        vocabularyRichness: cleanedSections[0] || 'Ingen data tillgänglig.',
        grammarMistakes: cleanedSections[1] || 'Ingen data tillgänglig.',
        improvements: cleanedSections[2] || 'Ingen data tillgänglig.',
        fillerWords: cleanedSections[3] || 'Ingen data tillgänglig.',
        summary: cleanedSections[4] || 'Ingen data tillgänglig.',
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
  console.log("Användar-ID som skickas:", userId);
  
  // Om inget userId finns (dvs gäst), sätt det till 'guest' för att hämta konversationerna för gäst.
  fetchConversations();
    fetchAnalysis();
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
