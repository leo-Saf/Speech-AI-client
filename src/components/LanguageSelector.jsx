// LanguageSelector.js
import React from 'react';

const languages = [
  { code: 'en', name: 'Engelska', flag: '🇬🇧' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'es', name: 'Spanska', flag: '🇪🇸' },
  { code: 'fr', name: 'Franska', flag: '🇫🇷' },
  { code: 'de', name: 'Tyska', flag: '🇩🇪' },
  { code: 'zh', name: 'Kinesiska', flag: '🇨🇳' },
];

const LanguageSelector = ({ onSelect }) => {
  return (
    <div className="language-selector">
      {languages.map((language) => (
        <div
          key={language.code}
          className="language-card"
          onClick={() => onSelect(language.code)}
        >
          <div style={{ fontSize: '40px' }}>{language.flag}</div>
          <h3>{language.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default LanguageSelector;
