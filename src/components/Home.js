// Home.js
import React, { useState } from 'react';

import AudioUploader from './AudioUploader';
import TranscriptHandler from './TranscriptHandler';

const Home = () => {
  return (
    <div>
      <h1>Välkommen till Språkinlärning</h1>
      <AudioUploader /> {}
      <TranscriptHandler /> {}
    </div>
  );
};

export default Home;