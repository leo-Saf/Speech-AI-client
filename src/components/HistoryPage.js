// HistoryPage.js
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import '../style.css';

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
        const conversationsRef = ref(db, 'conversations/'); // Hämta konversationer från databasen

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
    </div>
  );
};

export default HistoryPage;