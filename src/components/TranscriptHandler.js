import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';


const TranscriptHandler = () => {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const [status, setStatus] = useState('Not Connected');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  //const [language, setLanguage] = useState('');
  const lastTranscriptRef = React.useRef('');


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
          'e2998f677895517095fd772b3810024fb1340dfb',
        ]);

        socket.onopen = () => {
          setStatus('Connected');
          console.log('WebSocket connected');

          
          mediaRecorder.addEventListener('dataavailable', (event) => {
            if (event.data.size > 0 && socket.readyState === 1) {
              socket.send(event.data);
            }
          });

          mediaRecorder.start(250); 
        };

        // TODO fixa bättre hantering av dubbletter
        socket.onmessage = (message) => {
          try {
          const received = JSON.parse(message.data);
          const newTranscript = received.channel.alternatives[0]?.transcript || '';
      
          if (newTranscript && received.is_final) {
            console.log('Final transcript:', newTranscript);
      
            setTranscript((prev) => prev + newTranscript + ' ');
      
            // Save the last transcript to avoid duplicates
            //lastTranscriptRef.current = newTranscript;
          }

        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
        };

        socket.onclose = () => {
          setStatus('Disconnected');
          setTranscript(''); 
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
      if (socket) socket.close();
    };
  }, [selectedLanguage]); 

  useEffect(() => {
    setTranscript('');
  }, [selectedLanguage]);
  
    // Update language state based on user selection
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);  
  };

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
