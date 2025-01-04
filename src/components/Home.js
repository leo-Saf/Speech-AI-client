// Home.js
import React from 'react';
import AudioUploader from './AudioUploader';
import TranscriptHandler from './TranscriptHandler';
import '../styling.css';

const Home = ({ user, fetchEmails }) => {
  return (
    <div className="home-page">
      <h1 className="home-title">Welcome to Speech AI</h1> {/* Main header for the homepage */}
      <div className="audio-uploader-container">
        {/* Passing the userId or null and fetchEmails */}
        <AudioUploader userId={user?.id || null} fetchEmails={fetchEmails} />
        <TranscriptHandler />
      </div>
    </div>
  );
};

export default Home;
