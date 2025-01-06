import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './AdminPage.css';

const AllConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConversations, setShowConversations] = useState(false);

  // Function to fetch user email
  const fetchUserEmail = async (userId) => {
    // Check if userId is a guest and handle it separately
  if (userId.startsWith('Guest-')) {
    return `${userId}`;  // Return a default email address for guests
  }
    try {
      const response = await axios.get(`http://localhost:3001/api/get-user/${userId}`);
      return response.data.Email || userId; // If Email is missing, return UserId
    } catch (error) {
      console.error(`Fel vid hämtning av e-post för UserID: ${userId}`, error);
      return userId; // Return UserId if data cannot be fetched
    }
  };
  
  
  const fetchAllConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3001/api/get-all-conversations');
      const data = response.data;
  
      if (!data || data.length === 0) {
        setError('No conversations found.');
      } else {
        // Add email to each user
        const conversationsWithEmails = await Promise.all(
          data.map(async (conversation) => {
            if (!conversation.UserId) {
              console.warn('UserId is missing for a conversation:', conversation);
              return { ...conversation, Email: 'Guest - No ID available' };
            }
            const Email = await fetchUserEmail(conversation.UserId);
            return { ...conversation, Email };
          })
        );
  
        setConversations(conversationsWithEmails);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('An error occurred while fetching the conversations.');
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchAllConversations();
  }, []);

  // Handle displaying conversations
  const handleShowConversations = () => {
    setShowConversations(!showConversations);
  };

  const renderConversationList = () => {
    if (loading) return <p className="loading-text">Laddar...</p>;
    if (error) return <p className="error-text">{error}</p>;
  
    if (!conversations || conversations.length === 0)
      return <p>No conversations available.</p>;
  
    return conversations.map((conversation) => (
      <div key={conversation.UserId || Math.random()} className="conversation-card">
        <h3>
        User Identifier:{' '}
          {conversation.Email === conversation.UserId
            ? `: ${conversation.UserId}`
            : conversation.Email}
        </h3>
        {conversation.Conversations && conversation.Conversations.length > 0 ? (
          conversation.Conversations.map((userConversation) => (
            <div
              key={userConversation.ConversationId || Math.random()}
              className="conversation-details"
            >
              <h4>Datum: {userConversation.Date || 'Unknown date'}</h4>
              <p>
                Status: {userConversation.Ended ? 'Ended' : 'Ongoing'}
              </p>
              <ul>
                {userConversation.PromptsAndAnswers &&
                userConversation.PromptsAndAnswers.length > 0 ? (
                  userConversation.PromptsAndAnswers.map((item, index) => (
                    <li key={index}>
                      <strong>Question:</strong> {item?.Prompt || 'No question'} <br />
                      <strong>Answer:</strong> {item?.Answer || 'No answer'}
                    </li>
                  ))
                ) : (
                  <p>No questions or answers available.</p>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>No conversations for this user.</p>
        )}
      </div>
    ));
  };
  
  

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Admin - All Conversations</h1>

      <button onClick={handleShowConversations} className="show-conversations-button">
        {showConversations ? 'Hide conversations' : 'Show conversations'}
      </button>

      {showConversations && (
        <div className="conversation-list">
          {renderConversationList()}
        </div>
      )}
    </div>
  );
};

export { AllConversations };