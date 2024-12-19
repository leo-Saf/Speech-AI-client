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
      const response = await axios.get(url);
=======
      // Hämta data från API
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
      </div>
>>>>>>> Stashed changes
    </div>
  );
};

export default HistoryPage;
