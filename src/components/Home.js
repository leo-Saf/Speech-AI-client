// Home.js
import React from 'react';
import AudioUploader from './AudioUploader';
import '../styling.css';
const Home = ({ user }) => {
  return (
    <div className="home-page">
      <h1 className="home-title">Welcome to Speech AI</h1> {/* Main header for the homepage */}
      <div className="audio-uploader-container">
        {/* Passing the userId or null if there is no user */}
        <AudioUploader userId={user?.id || null} />
      </div>
    </div>
  );
};

export default Home;
