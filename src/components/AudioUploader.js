import React, { useState, useEffect, useRef } from 'react';
import { uploadAudio } from '../client';
import '../style.css';

const AudioUploader = ({ userId }) => {
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  //const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [responseAudio, setResponseAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const microphoneRef = useRef(null);

  const MAX_SILENCE_TIME = 3000; // ti´d efter man börjar prata
  const SILENCE_THRESHOLD = 30;
  const MAX_RECORDING_TIME = 15000; // 30 s max tid oavsett om man slutar prata eller ej
  const recordingTimeoutRef = useRef(null);
  const silenceHistory = [];
  let silenceTimeout = null;

  useEffect(() => {
    const setupRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const options = { mimeType: 'audio/webm' };
        const recorder = new MediaRecorder(stream, options);
        setMediaRecorder(recorder);

        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
        microphoneRef.current.connect(analyserRef.current);

        console.log('userid = ', userId);
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

      const isSilent = silenceHistory.every((level) => level < SILENCE_THRESHOLD);

      if (isSilent && silenceHistory.length === 10) {
        if (!silenceTimeout) {
          silenceTimeout = setTimeout(() => {
            console.log('Tystnad detekterad, stoppar inspelningen...');
            handleStopRecording(); // Stoppa inspelningen vid tystnad
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

  const handleStartConversation = () => {
    console.log('userid = ', userId);
    setIsConversationStarted(true);
    //sendMessageToServer('START CONVO'); // SKCIKAS TILL SERVERN TESTA!!!!!!
  };

  const handleStopConversation = () => {
    console.log('userid = ', userId);
    setIsConversationStarted(false);
    //sendMessageToServer(userId); // TESTA!!!!
    setIsRecording(false);
    setIsPaused(false);
    clearTimeout(silenceTimeout);
  };

  const handleStartRecording = () => {
    if (!mediaRecorder) return;
    if (isPaused) {
      mediaRecorder.resume();
      setIsPaused(false);
    } else {
      mediaRecorder.start();
      setIsRecording(true);
      silenceHistory.length = 0;

      // timeout
    recordingTimeoutRef.current = setTimeout(() => {
      console.log('Max inspelningstid uppnådd, stoppar...');
      handleStopRecording();
    }, MAX_RECORDING_TIME);
    }

    console.log('MediaRecorder state:', mediaRecorder.state);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        const audioBlob = new Blob([event.data], { type: 'audio/webm' });
        console.log('AudioBlob:', audioBlob);
        handleUpload(audioBlob);
      }
    };
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
      clearTimeout(silenceTimeout);


    // resettar timer
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }

    console.log('Recording stopped manually OR by timer.');

      /*if (audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioChunks(audioBlob);
        handleUpload(audioBlob);
      } else {
        console.error("Ingen ljuddata att bearbeta.");
      }

      setAudioChunks([]); // tar bort gammalt data från audio chunk eftersom denna funktion ska inte räknas som paus funktionen*/
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
      const uploadId = userId; // Använd INTE "guest" om userId saknas
    console.log('Uppladdar ljud med ID:', uploadId);
    console.log('Data som skickas till backend:', blob);

    const response = await uploadAudio(blob, uploadId);
    
      console.log('Uppladdning lyckades:', response);
      const audioURL = URL.createObjectURL(response);
      setResponseAudio(audioURL);
    } catch (error) {
      console.error('Fel vid uppladdning:', error);
      alert(`Fel vid uppladdning: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (responseAudio && audioRef.current) {
      const audioElement = audioRef.current;
      audioElement.src = responseAudio;
      audioElement.play().catch((error) => console.error('Fel vid uppspelning:', error));

      audioElement.onended = () => {
        console.log('AI svarat. Spelar in...');
        handleStartRecording();
      };
    }
  }, [responseAudio]);

  return (
    <div className="audio-uploader">
      {!isConversationStarted ? (
        <button
          onClick={handleStartConversation}
          className="btn start-conversation-btn"
        >
          Starta Konversation
        </button>
      ) : (
        <>
          <button
            onClick={handleStopConversation}
            className="btn stop-conversation-btn"
          >
            Stoppa Konversation
          </button>
          <div className="recording-controls">
            {!isRecording ? (
              <button onClick={handleStartRecording} disabled={loading} className="btn start-btn">
                Starta inspelning
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
              <audio ref={audioRef} controls className="audio-player"></audio>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const sendMessageToServer = async (message) => {
  await fetch('/api/end-conversation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }), // JSON meddelande
  });
};


export default AudioUploader;
