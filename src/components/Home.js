// Home.js
import React from 'react';
import AudioUploader from './AudioUploader';

const Home = ({ user }) => {
 

 

  return (
    <div>
      <h1>Välkommen till Språkinlärning</h1>
      <AudioUploader userId={user?.id || null} /> {/* Skickar userId eller null */}
    </div>
  );
};

export default Home;