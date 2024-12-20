// Home.js
import React from 'react';
import AudioUploader from './AudioUploader';

const Home = ({ user }) => {
  return (
    <div>
      <h1>Welcome to Speech AI</h1> {/* Main header for the homepage */}
      {/* Passing the userId or null if there is no user */}
      <AudioUploader userId={user?.id || null} />
    </div>
  );
};

export default Home;
