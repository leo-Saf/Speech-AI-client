import React from 'react';
import AudioUploader from './AudioUploader';

const Home = ({ user }) => {
  return (
    <div className="home-container">
      <h1>Välkommen till Speech AI</h1>
      <AudioUploader userId={user?.id || null} />
    </div>
  );
};

export default Home;
