import React, { useState, useEffect, useRef } from 'react';
import { uploadAudio } from '../client';
<<<<<<< Updated upstream:src/components/AudioUploader.jsx
=======
import '../style.css';
>>>>>>> Stashed changes:src/components/AudioUploader.js

<<<<<<< Updated upstream:src/components/AudioUploader.jsx
const AudioUploader = () => {
  const [audioBlob, setAudioBlob] = useState(null);
=======

const AudioUploader = () => {
  //const [audioBlob, setAudioBlob] = useState(null);
>>>>>>> Stashed changes:src/components/AudioUploader.js
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [responseAudio, setResponseAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const microphoneRef = useRef(null);
  

  const MAX_SILENCE_TIME = 5000;
  const SILENCE_THRESHOLD = 30;
  const silenceHistory = [];
  let silenceTimeout = null;
  let recordingTimeout = null;

  useEffect(() => {
    const setupRecorder = async () => {
      if (!window.MediaRecorder) {
        alert('Din webbläsare stöder inte ljudinspelning.');
        return;
      }
  
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
<<<<<<< Updated upstream:src/components/AudioUploader.jsx
        let options = { mimeType: 'audio/webm' };
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          console.warn('audio/webm stöds inte. Försöker använda audio/wav istället.');
          options = { mimeType: 'audio/wav' };
        }
  
        try {
          const recorder = new MediaRecorder(stream, options);
          setMediaRecorder(recorder);
        } catch (e) {
          console.warn('Ingen MIME-typ stöds, använder ingen MIME-typ alls');
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
        }
  
=======
        const options = { mimeType: 'audio/webm' };
        const recorder = new MediaRecorder(stream, options);
        setMediaRecorder(recorder);

        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
        microphoneRef.current.connect(analyserRef.current);
>>>>>>> Stashed changes:src/components/AudioUploader.js
      } catch (error) {
        console.error('Fel vid åtkomst till mikrofonen:', error);
      }
    };

    setupRecorder();
  }, []);
  

  useEffect(() => {
    const drawWaveform = () => {
      if (!canvasRef.current || isPaused) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      const avgLevel = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      silenceHistory.push(avgLevel);

      if (silenceHistory.length > 10) silenceHistory.shift();

      const isSilent = silenceHistory.every(level => level < SILENCE_THRESHOLD);

      if (isSilent && silenceHistory.length === 10) {
        if (!silenceTimeout) {
          silenceTimeout = setTimeout(() => {
            console.log('Tystnad detekterad, stoppar inspelningen...');
            handleStopRecording();  // Stoppa inspelningen vid tystnad, och bearbeta ljudet automatiskt
          }, MAX_SILENCE_TIME);
        }
      } else {
        clearTimeout(silenceTimeout);
        silenceTimeout = null;
      }

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 255;
        const y = v * canvas.height;
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(x, canvas.height - y, sliceWidth, y);
        x += sliceWidth;
      }

      requestAnimationFrame(drawWaveform);
    };

    if (isRecording && !isPaused) {
      drawWaveform();
    }
  }, [isRecording, isPaused]);

  const handleStartRecording = () => {
    if (!mediaRecorder) return;

    if (isPaused) {
      // Återuppta inspelning från där vi pausade
      mediaRecorder.resume();
      setIsPaused(false);
    } else {
      // Starta ny inspelning
      mediaRecorder.start();
      setIsRecording(true);
      silenceHistory.length = 0; // Rensa historik om ny inspelning startar
    }
<<<<<<< Updated upstream:src/components/AudioUploader.jsx

    console.log('MediaRecorder state:', mediaRecorder.state);  // Logga status på recorder

    if (recordingTimeout) clearTimeout(recordingTimeout);
    recordingTimeout = setTimeout(() => {
      handleStopRecording();
    }, 5000); // 5 sek för automatisk stoppning
=======
  
    console.log('MediaRecorder state:', mediaRecorder.state);
  
    if (recordingTimeout) clearTimeout(recordingTimeout);
    recordingTimeout = setTimeout(() => {
      handleStopRecording();
    }, 5000); // 5 sekunder för automatisk stoppning
>>>>>>> Stashed changes:src/components/AudioUploader.js

    mediaRecorder.ondataavailable = (event) => {
      console.log('Inspelad data:', event.data); // Här loggar vi själva datan
      if (event.data.size > 0) {
        const audioBlob = new Blob([event.data], { type: 'audio/webm' });
        console.log('AudioBlob:', audioBlob);  // Här loggar vi bloben
        setAudioBlob(audioBlob);
      } else {
        console.error("Ingen ljuddata i event.data");
      }
    };
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      clearTimeout(recordingTimeout);
      setIsRecording(false);
      setIsPaused(false);
      clearTimeout(silenceTimeout);

      // Kontrollera om audioBlob finns innan uppladdning
      if (audioBlob) {
        console.log("Laddar upp ljuddata...");
        handleUpload(audioBlob);
      } else {
        console.error("No audio data to process.");
      }
    }
  };

  const handlePauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  
  const handleUpload = async (blob) => {
    setLoading(true);
  
    try {
<<<<<<< Updated upstream:src/components/AudioUploader.jsx
<<<<<<< Updated upstream:src/components/AudioUploader.jsx
      const response = await uploadAudio(blob);  // Försök att ladda upp ljudfilen
=======
      if (!userId) {
        throw new Error('Användar-ID saknas....');
      }
      console.log('Uppladdar ljud med användar-ID:', userId);
=======
      // Hämta användar-ID eller sätt "guest" om userId saknas
      const uploadId = userId || null;
      console.log('Uppladdar ljud med ID:', uploadId);  // Logga användar-ID:t som används
>>>>>>> Stashed changes:src/components/AudioUploader.js
  
      
      // Logga datan som skickas till backend
    console.log('Data som skickas till backend:', blob);
<<<<<<< Updated upstream:src/components/AudioUploader.jsx
      const response = await uploadAudio(blob, userId);
>>>>>>> Stashed changes:src/components/AudioUploader.js
=======

    const response = await uploadAudio(blob, uploadId);

>>>>>>> Stashed changes:src/components/AudioUploader.js
      console.log('Uppladdning lyckades:', response);
      const audioURL = URL.createObjectURL(response);
      setResponseAudio(audioURL);  // Sätt ljudfilen som en URL att spela upp
    } catch (error) {
      console.error('Fel vid uppladdning:', error);  // Logga hela felobjektet
      alert(`Fel vid uppladdning: ${error.message}`); // Visa användaren detaljer om felet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (responseAudio && audioRef.current) {
      audioRef.current.play();
    }
  }, [responseAudio]);

  return (
    <div className="audio-uploader">
      <h2 className="title">Start recording</h2>
      <div className="recording-controls">
        {!isRecording ? (
          <button onClick={handleStartRecording} disabled={loading} className="btn start-btn">
            Start recording
          </button>
        ) : isPaused ? (
          <button onClick={handleStartRecording} disabled={loading} className="btn resume-btn">
            Återuppta inspelning
          </button>
        ) : (
          <>
            <button onClick={handleStopRecording} disabled={loading} className="btn stop-btn">
              Stoppa inspelning
            </button>
            <button onClick={handlePauseRecording} disabled={loading} className="btn pause-btn">
              Pausa inspelning
            </button>
          </>
        )}
        {loading && <p className="loading-text">Bearbetar ljud...</p>}
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef} className="waveform-canvas"></canvas>
      </div>

      {responseAudio && (
        <div className="audio-preview">
          <h3>Bearbetat ljud</h3>
          <audio ref={audioRef} src={responseAudio} controls className="audio-player"></audio>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
