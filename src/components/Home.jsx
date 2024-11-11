// Home.js
import React, { useState } from 'react';

import AudioUploader from './AudioUploader';

const Home = () => {
  return (
    <div>
      <h1>Välkommen till Språkinlärning</h1>
      <AudioUploader /> {/* Behåll AudioUploader om du vill ha den */}
    </div>
  );
};

export default Home;
