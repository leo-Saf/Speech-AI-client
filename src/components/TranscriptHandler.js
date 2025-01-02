import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';

// This class handles the transcription of the audio input from the user and shows it in realtime using Deepgrams API
const TranscriptHandler = () => {
  const { selectedLanguage, setSelectedLanguage, isPaused } = useLanguage();
  const [status, setStatus] = useState('Not Connected');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const lastTranscriptRef = React.useRef('');

  /**
   * Main useEffect hook for handling WebSocket and MediaRecorder setup
   * Establishes connection to Deepgram API and manages audio streaming
   */
  useEffect(() => {
    let mediaRecorder;
    let socket;

    // Return nothing if no language is selected
    if (!selectedLanguage) 
    return;

    const setupTranscription = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          alert('Browser not supported');
          return;
        }

        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        
        console.log('Selected language:', selectedLanguage);
        // Dynamic WebSocket URL that changes language for the selected language of the user
        const socketUrl = `wss://api.deepgram.com/v1/listen?model=nova-2&language=${selectedLanguage}`;
        console.log('WebSocket URL:', socketUrl);

        socket = new WebSocket(socketUrl, [
          'token',
          process.env.REACT_APP_DEEPGRAM_API_KEY,
        ]);

        socket.onopen = () => {
          setStatus('Connected');
          console.log('WebSocket connected');

          
          mediaRecorder.addEventListener('dataavailable', (event) => {
            if (event.data.size > 0 && socket.readyState === 1 && !isPaused) {
              socket.send(event.data);
            }
          });

          mediaRecorder.start(250); 
        };
      
        // Handle incoming transcription data
        socket.onmessage = (message) => {
          if(isPaused) return;
          try {
          const received = JSON.parse(message.data);
          const newTranscript = received.channel.alternatives[0]?.transcript || '';
      
          if (newTranscript && received.is_final) {
            console.log('Final transcript:', newTranscript);
      
            setTranscript((prev) => prev + newTranscript + ' ');
      

          }

        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
        };

        socket.onclose = () => {
          setStatus('Disconnected');
          console.log('WebSocket closed');
        };

        socket.onerror = (error) => {
          setError('WebSocket Error');
          console.error('WebSocket error:', error);
        };
      } catch (err) {
        setError('Error accessing microphone: ' + err.message);
      }
    };

    setupTranscription();

    return () => {
      if (mediaRecorder) mediaRecorder.stop();
      if (socket && !isPaused) socket.close();
    };
  }, [selectedLanguage, isPaused]); 

  // Clear the transcript only when a new language is selected
  useEffect(() => {
    if (selectedLanguage !== '') {
      setTranscript('');
    }
  }, [selectedLanguage]);
  
  // Update language state based on user selection
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);  
  };

// The component creates a dropdown menu for selecting the language and showing the transcription text in reatime.
  return (
    <div>
      <div className='language-selector'>
        <label htmlFor="language-selector"></label>
        <select
          id="language-selector"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="">Select Language</option>
          <option value="en">English🇬🇧</option>
          <option value="es">Spanish🇪🇸</option>
          <option value="de">German🇩🇪</option>
          <option value="fr">French🇫🇷</option>
          <option value="sv">Swedish🇸🇪</option>
        </select>
      </div>

      <div style={{ border: '1px solid #1a202c', padding: '10px', marginTop: '20px' }}>
        <h3>Transcription:</h3>
        <p style={{ whiteSpace: 'pre-wrap', color: 'white' }}>{transcript}</p>
        {selectedLanguage && (
          <div>

          </div>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TranscriptHandler;
