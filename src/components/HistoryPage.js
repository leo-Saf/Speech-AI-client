<<<<<<< Updated upstream
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import '../style.css';

<<<<<<< Updated upstream
const HistoryPage = () => {
  const [conversations, setConversations] = useState([]);
  const [user, setUser] = useState(null); // För att hålla reda på den inloggade användaren
  const navigate = useNavigate();

  // Kontrollera om användaren är inloggad och hämta konversationer
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUser(user); // Sätt användaren

        // Hämta konversationer från användarens specifika del i databasen
        const conversationsRef = ref(db, 'conversations/' + user.uid); // Hämta konversationer för den inloggade användaren

        try {
          const snapshot = await get(conversationsRef); // Hämta data från Firebase
          if (snapshot.exists()) {
            const data = snapshot.val();
            console.log('Data från Firebase:', data);

            // Skapa en lista med konversationerna
            const conversationsList = Object.keys(data).map(key => ({
              id: key,
              ...data[key], // Lägg till alla fält från konversationen
            }));
            setConversations(conversationsList); // Uppdatera state med konversationerna
          } else {
            console.log('Inga konversationer tillgängliga.');
          }
        } catch (error) {
          console.log('Fel vid hämtning av konversationer:', error);
        }
=======
const HistoryPage = ({ userId  }) => {
  const [conversations, setConversations] = useState({
    singleUserConversations: [],
    multiUserConversations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("Mottaget userId i HistoryPage:", userId);

  // Funktion för att hämta konversationer
  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

<<<<<<< Updated upstream
      const url = userId
        ? `http://localhost:3001/get-user-conversations/${userId}`
        : `http://localhost:3001/get-guest-conversations`; // Gästkonversationer om inte inloggad
=======
      // Hantera om inget userId tillhandahålls (dvs gäst)
    const userIdentifier = userId || ''; // Om användar-ID är null, sätt till 'guest'
>>>>>>> Stashed changes

<<<<<<< Updated upstream
<<<<<<< Updated upstream
      const response = await axios.get(url);
=======
      // Hämta data från API
      const response = await axios.get(`http://localhost:3001/get-user-conversations/${userIdentifier}`);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
      // Handle case where no userId is provided (i.e., guest)
      const userIdentifier = userId || ' '; // If userId is null, set to 'guest'

      // Fetch data from the API
      const response = await axios.get(`http://localhost:3001/get-user-conversations/${userIdentifier}`);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      const data = response.data;

      setConversations({
        singleUserConversations: data.singleUserConversations || [],
        multiUserConversations: data.multiUserConversations || [],
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setError('Inga konversationer hittades.');
>>>>>>> Stashed changes
      } else {
        console.log('Ingen användare är inloggad');
        navigate('/'); // Navigera till startsidan om användaren inte är inloggad
      }
    };

    fetchData();
  }, []); // Kör endast vid komponentladdning

  const handleGoBack = () => {
    navigate('/'); // Navigera till hemsidan
  };

<<<<<<< Updated upstream
=======
  useEffect(() => {
<<<<<<< Updated upstream
    fetchConversations();
  }, [userId]);
=======
  console.log("Användar-ID som skickas:", userId);
 
  // Om inget userId finns (dvs gäst), sätt det till 'guest' för att hämta konversationerna för gäst.
  fetchConversationsAndAnalysis();
}, [userId]); // Körs om userId ändras

>>>>>>> Stashed changes

<<<<<<< Updated upstream
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


>>>>>>> Stashed changes
  return (
    <div className="history-container">
      <h2>Historik</h2>
      {user && <p>Välkommen, {user.displayName || 'Användare'}!</p>} {/* Visa användarens namn */}
      <ul>
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <li key={conversation.id}>
              <p><strong>Prompt:</strong> {conversation.Prompt}</p>
              <p><strong>Answer:</strong> {conversation.Answer}</p>
              <p><strong>Date:</strong> {conversation.Date}</p>

<<<<<<< Updated upstream
              {conversation.PromptAudioURL && (
                <button onClick={() => new Audio(conversation.PromptAudioURL).play()}>
                  Spela upp Prompt ljud
                </button>
              )}
              {conversation.AnswerAudioURL && (
                <button onClick={() => new Audio(conversation.AnswerAudioURL).play()}>
                  Spela upp Answer ljud
                </button>
              )}
            </li>
          ))
        ) : (
          <p>Inga konversationer hittades.</p>
        )}
      </ul>
      <button className="back-button" onClick={handleGoBack}>Tillbaka till Hemsidan</button>
=======
      {loading && <p>Laddar...</p>}
      {error && <p className="error">{error}</p>}

      <div className="conversation-list">
        {(!loading && conversations.singleUserConversations.length === 0 &&
          conversations.multiUserConversations.length === 0) && (
            <p>Inga konversationer att visa.</p>
        )}

        {/* Rendera enkelanvändarkonversationer */}
        {renderConversationList(conversations.singleUserConversations)}

        {/* Rendera fleranvändarkonversationer */}
        {renderConversationList(conversations.multiUserConversations)}
=======
  // Renders a list of conversations (both single-user and multi-user)
  const renderConversationList = (conversationsList) => {
    return conversationsList.map((conversation) => (
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
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        <div className="conversation-list">
          {!loading &&
            conversations.singleUserConversations.length === 0 &&
            conversations.multiUserConversations.length === 0 && (
              <p>No conversations to show.</p>
            )}

          {/* Single user conversations */}
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

          {/* Multi user conversations */}
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
        {analysisLoading && <p>Loading analysis...</p>}
        {analysisError && <p className="error">{analysisError}</p>}

        {!analysisLoading && !analysisError && (
  <div className="analysis-grid">
    <div className="analysis-card">
      <h2>Vocabulary richness</h2>
      <p>{analysis?.vocabularyRichness || 'No data available.'}</p>
    </div>
    <div className="analysis-card">
      <h2>Grammatical errors</h2>
      <p>{analysis?.grammarMistakes || 'No data available.'}</p>
    </div>
    <div className="analysis-card">
      <h2>Improvements</h2>
      <p>{analysis?.improvements || 'No data available.'}</p>
    </div>
    <div className="analysis-card">
      <h2>Filler words</h2>
      <p>{analysis?.fillerWords || 'No data available.'}</p>
    </div>
    <div className="analysis-card summary-card">
      <h2>Summary</h2>
      <p>{analysis?.summary || 'No data available.'}</p>
    </div>
  </div>
)}

>>>>>>> Stashed changes
      </div>
>>>>>>> Stashed changes
=======
import { useState, useEffect } from 'react';
import axios from 'axios';

const Conversations = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        let userId = currentUser ? currentUser.email : ''; // If no user logged in, empty string will fetch for guest

        // Make API call to fetch conversations
        const response = await axios.get(`http://localhost:3001/api/get-user-conversations/${userId}`);
        
        // If user is a guest, conversations will be a single list
        // If user is logged in, conversations will be divided into two categories: singleUserConversations, multiUserConversations
        const fetchedConversations = currentUser ? response.data : response.data.conversations;
        
        setConversations(fetchedConversations);
      } catch (error) {
        setError('Error fetching conversations');
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser]);  // Re-run this effect if `currentUser` changes

  return (
    <div>
      {loading ? <p>Loading...</p> : (
        <div>
          {error && <p>{error}</p>}
          <h2>{currentUser ? "Your Conversations" : "Guest Conversations"}</h2>
          <ul>
            {conversations && conversations.length > 0 ? (
              conversations.map((conversation, index) => (
                <li key={index}>
                  {conversation.title ? conversation.title : 'Untitled'}
                </li>
              ))
            ) : (
              <p>No conversations available.</p>
            )}
          </ul>
        </div>
      )}
>>>>>>> Stashed changes
    </div>
  );
};

<<<<<<< Updated upstream
export default HistoryPage;
=======
export default Conversations;
>>>>>>> Stashed changes
