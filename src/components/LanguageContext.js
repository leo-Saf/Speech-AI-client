import React, { createContext, useState, useContext } from 'react';

// Create the context
const LanguageContext = createContext(null);

// This class is used to provide the language context to the rest of the application
export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <LanguageContext.Provider value={{ 
      selectedLanguage, 
      setSelectedLanguage, 
      isRecording,
      setIsRecording,
      isPaused,
      setIsPaused }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};