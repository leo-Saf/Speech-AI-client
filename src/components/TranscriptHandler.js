import React, { useEffect, useState } from 'react';

const TranscriptHandler = () => {
  const [status, setStatus] = useState('Not Connected');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  // Got duplicates, so this checks for duplicates of the same word/sentence
  const lastTranscriptRef = React.useRef('');

  useEffect(() => {
    let mediaRecorder;
    let socket;

    const setupTranscription = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          alert('Browser not supported');
          return;
        }

        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

        // Create WebSocket connection
        socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
          'token',
          'e2998f677895517095fd772b3810024fb1340dfb',
        ]);

        socket.onopen = () => {
          setStatus('Connected');
          console.log('WebSocket connected');

          // Send audio data to WebSocket server
          mediaRecorder.addEventListener('dataavailable', (event) => {
            if (event.data.size > 0 && socket.readyState === 1) {
              socket.send(event.data);
            }
          });

          mediaRecorder.start(250); 
        };

        socket.onmessage = (message) => {
          try {
            const received = JSON.parse(message.data);
            const newTranscript = received.channel.alternatives[0]?.transcript || '';

            if (newTranscript && received.is_final) {

              if (newTranscript !== lastTranscriptRef.current) {
                setTranscript((prev) => prev + newTranscript + ' ');
                lastTranscriptRef.current = newTranscript; 
                console.log('Final transcript:', newTranscript);
              }
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
      if (socket) socket.close();
    };
  }, []); 

  return (
    <div>
      <div style={{ border: '1px solid #1a202c', padding: '10px', marginTop: '20px' }}>
        <h3>Transcription:</h3>
        <p style={{ whiteSpace: 'pre-wrap', color: 'white' }}>{transcript}</p>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TranscriptHandler;
