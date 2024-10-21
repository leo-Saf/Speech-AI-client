// Home.js
import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import AudioUploader from './AudioUploader';

const Home = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleSelectLanguage = (language) => {
    setSelectedLanguage(language);
    console.log(`Valt språk: ${language}`);
  };

  return (
    <div>
      <h1>Välkommen till Språkinlärning</h1>
      <div className="language-selector">
        <LanguageSelector onSelect={handleSelectLanguage} />
      </div>
      {selectedLanguage && <p>Du har valt: {selectedLanguage}</p>}
      {selectedLanguage && <AudioUploader selectedLanguage={selectedLanguage} />}
    </div>
  );
};

export default Home;
