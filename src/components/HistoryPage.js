import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HistoryStyle.css';

const HistoryPage = ({ userId }) => {
  const [conversations, setConversations] = useState({ singleUserConversations: [], multiUserConversations: [] });
  const [analysis, setAnalysis] = useState({});
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [startDate, setStartDate] = useState("");  // Start date state
  const [endDate, setEndDate] = useState("");      // End date state

  const fetchConversationsAndAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      setAnalysisLoading(true);
      setAnalysisError(null);
      setAnalysis({}); // Reset analysis before fetching new data

      let userIdentifier = userId;

      // If no userId is provided, fetch a guest ID from backend
      if (!userIdentifier) {
        const response = await axios.get('http://localhost:3001/api/get-guest-id');
        userIdentifier = response.data.guestId; // Use the generated guestId
      }

      console.log("Fetching data for userIdentifier:", userIdentifier);

      // Fetch data from the API
      const response = await axios.get(`http://localhost:3001/api/get-user-conversations/${userIdentifier}`);
      const data = response.data;
      if (!data) {
        console.error("No response from the server");
        setError('An issue occurred while fetching conversations.');
        return;
      }

      try {
        setConversations({
          singleUserConversations: data.singleUserConversations || [],
          multiUserConversations: data.multiUserConversations || [],
        });
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching conversations.');
      } finally {
        setLoading(false);
      }

      try {
        setAnalysis(data.analysisData);
      } catch (err) {
        console.error(err);
        setAnalysisError('An error occurred while fetching analysis data.');
      } finally {
        setAnalysisLoading(false);
      }
    } catch (err) {
      console.error("Error fetching data:" + err);
      setAnalysisError('An error occurred while fetching conversations and analysis data.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  useEffect(() => {
    console.log("User ID being sent:", userId);

    // If no userId is provided (i.e., guest), set it to 'guest' to fetch guest conversations
    fetchConversationsAndAnalysis();
  }, [userId]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filterConversationsByDateRange = (conversationsList) => {
    if (!startDate && !endDate) return conversationsList;

    return conversationsList.filter((conversation) => {
      const conversationDate = conversation.Date;
      if (startDate && endDate) {
        return new Date(conversationDate) >= new Date(startDate) && new Date(conversationDate) <= new Date(endDate);
      }
      if (startDate) {
        return new Date(conversationDate) >= new Date(startDate);
      }
      if (endDate) {
        return new Date(conversationDate) <= new Date(endDate);
      }
      return true;
    });
  };

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
    <div className="history-analysis-page">
      <div className="history-section">
        <h1>Conversation history</h1>

        <div className="filter-section">
          <label htmlFor="start-date-filter">Start Date:</label>
          <input
            type="date"
            id="start-date-filter"
            value={startDate}
            onChange={handleStartDateChange}
          />

          <label htmlFor="end-date-filter">End Date:</label>
          <input
            type="date"
            id="end-date-filter"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        <div className="conversation-list">
          {!loading &&
            conversations.singleUserConversations.length === 0 &&
            conversations.multiUserConversations.length === 0 && (
              <p>No conversations to show.</p>
            )}

          {conversations.singleUserConversations.length > 0 && (
            <>
              <h2>Single user conversations</h2>
              {renderConversationList(
                conversations.singleUserConversations.sort(
                  (a, b) => new Date(b.Date) - new Date(a.Date)
                )
              )}
            </>
          )}

          {conversations.multiUserConversations.length > 0 && (
            <>
              <h2>Multi user conversations</h2>
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
        <h1>Text analysis</h1>
        {analysisLoading && <p>Loading...</p>}
        {analysisError && <p className="error">{analysisError}</p>}

        {!analysisLoading && !analysisError && (
          <div className="analysis-grid">
            <div className="analysis-card">
              <h2>Vocabulary richness</h2>
              <p>{analysis.vocabularyRichness || 'No data available.'}</p>
            </div>
            <div className="analysis-card">
              <h2>Grammatical errors</h2>
              <p>{analysis.grammarMistakes || 'No data available.'}</p>
            </div>
            <div className="analysis-card">
              <h2>Improvements</h2>
              <p>{analysis.improvements || 'No data available.'}</p>
            </div>
            <div className="analysis-card">
              <h2>Filler words</h2>
              <p>{analysis.fillerWords || 'No data available.'}</p>
            </div>
            <div className="analysis-card summary-card">
              <h2>Summary</h2>
              <p>{analysis.summary || 'No data available.'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
