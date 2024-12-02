// Home.js
import React from 'react';
import AudioUploader from './AudioUploader';
import TranscriptHandler from './TranscriptHandler';

const Home = ({ user }) => {
 

 

  return (
    <div>
      <h1>Välkommen till Språkinlärning</h1>
      <AudioUploader userId={user?.id || null} /> {/* Skickar userId eller null */}
      <TranscriptHandler /> {}
    </div>
  );
};

export default Home;