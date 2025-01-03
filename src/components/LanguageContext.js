import React, { createContext, useState, useContext } from 'react';

/**
 * Context for managing language and recording state across components.
 * Initially set to null as it will be populated by the Provider.
 */
const LanguageContext = createContext(null);
/**
 * Provider component that manages shared state for language selection and recording status.
 * Wraps the application to make these states available to all child components.
 */
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