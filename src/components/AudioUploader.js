import React, { useState, useEffect, useRef } from 'react';
import { uploadAudio } from '../client';


const AudioUploader = ({ userId, fetchAndResetEmails }) => {

  console.log(' /////// AudioUploader received fetchAndResetEmails:', fetchAndResetEmails);

  const [isConversationStarted, setIsConversationStarted] = useState(false);
  // const [audioBlob, setAudioBlob] = useState(null);
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

  const MAX_SILENCE_TIME = 3000; // Time after the user starts talking before silence is detected
  const SILENCE_THRESHOLD = 30; // Threshold for silence detection
  const MAX_RECORDING_TIME = 15000; // Maximum recording time (15 seconds) regardless of whether the user stops talking or not
  const recordingTimeoutRef = useRef(null); // Ref to handle the maximum recording time timeout
  const silenceHistory = []; // Keeps track of the silence history
  let silenceTimeout = null; // Timeout variable for silence detection

  useEffect(() => {
    const setupRecorder = async () => {
      try {
        // Request permission for the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Create a new MediaRecorder instance
        const options = { mimeType: 'audio/webm' };
        const recorder = new MediaRecorder(stream, options);
        setMediaRecorder(recorder);

        // Initialize AudioContext for visualizing audio
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        // Create a media stream source connected to the analyser
        microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
        microphoneRef.current.connect(analyserRef.current);

        console.log('User ID = ', userId); // Log user ID (for debugging)
      } catch (error) {
        console.error('Error accessing the microphone:', error); // Log error if access is denied or fails
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
            console.log('Silence detected, stopping recording...');
            handleStopRecording(); // Stop the recording due to silence
          }, MAX_SILENCE_TIME);
        }
      } else {
        clearTimeout(silenceTimeout);
        silenceTimeout = null; // Reset the silence timeout if silence is not detected
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

      requestAnimationFrame(drawWaveform); // Repeatedly call to draw the waveform
    };

    // If recording is happening and not paused, continue drawing the waveform
    if (isRecording && !isPaused) {
      drawWaveform();
    }
  }, [isRecording, isPaused]); // Dependencies for effect to rerun based on recording or pause status

  // Start the conversation
  const handleStartConversation = () => {
    console.log('userid = ', userId);
    setIsConversationStarted(true);
     //sendMessageToServer('START CONVO'); // SEND TO SERVER - TESTING
  };

  // Stop the conversation
  const handleStopConversation = () => {
    console.log('1. fetchAndResetEmails:', typeof fetchAndResetEmails);
    console.log('userid = ', userId);
    console.log('.............................................................................'); // delete when done testing emails
    const emails = fetchAndResetEmails; // Fetch emails from App.js and reset
    console.log('2. fetchAndResetEmails:', typeof fetchAndResetEmails);

    if (!emails) {
      console.error('Emails are undefined or invalid:', emails);
    } else {
      console.log('Fetched emails:', emails);
      console.log('Sending emails to server:', emails);
    }
    
    setIsConversationStarted(false);
    //sendMessageToServer(userId); // TESTING
    setIsRecording(false);
    setIsPaused(false);
    clearTimeout(silenceTimeout);
  };

  // Start recording
  const handleStartRecording = () => {
    if (!mediaRecorder) return;
    if (isPaused) {
      mediaRecorder.resume(); // Resume recording if it was paused
      setIsPaused(false);
    } else {
      mediaRecorder.start(); // Start recording if it's not paused
      setIsRecording(true);
      silenceHistory.length = 0;

      // Timeout to stop recording after a maximum time
    recordingTimeoutRef.current = setTimeout(() => {
      console.log('Max recording time reached, stopping...');
      handleStopRecording();
    }, MAX_RECORDING_TIME);
    }

    console.log('MediaRecorder state:', mediaRecorder.state);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        const audioBlob = new Blob([event.data], { type: 'audio/webm' });
        console.log('AudioBlob:', audioBlob);
        handleUpload(audioBlob); // Handle the upload of audio after recording
      }
    };
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop(); // Stop recording manually or by the timer
      setIsRecording(false);
      setIsPaused(false);
      clearTimeout(silenceTimeout); // Clear the silence detection timeout


    // Reset the timer
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
      const uploadId = userId; // DO NOT use "guest" if userId is missing
    console.log('Uploading audio with ID:', uploadId);
    console.log('Data being sent to backend:', blob);

    const response = await uploadAudio(blob, uploadId);
    
      console.log('Upload successful:', response);
      const audioURL = URL.createObjectURL(response);
      setResponseAudio(audioURL); // Set the audio to be playable
  
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload error: ${error.message}`);// Show error message to the user
    } finally {
      setLoading(false);   // Turn off loading indicator
    }
  };
  
  useEffect(() => {
    if (responseAudio && audioRef.current) {
      const audioElement = audioRef.current;
      audioElement.src = responseAudio;
      audioElement.play().catch((error) => console.error('Error during playback:', error));

      audioElement.onended = () => {
        console.log('AI responded. Recording...');
        handleStartRecording();
      };
    }
  }, [responseAudio]);  // Run every time responseAudio changes
  

  return (
    <div className="audio-uploader">
      {!isConversationStarted ? (
        <button
          onClick={handleStartConversation}
          className="btn start-conversation-btn"
        >
          Start Conversation
        </button>
      ) : (
        <>
          <button
            onClick={handleStopConversation}
            className="btn stop-conversation-btn"
          >
            Stop Conversation
          </button>
          <div className="recording-controls">
            {!isRecording ? (
              <button onClick={handleStartRecording} disabled={loading} className="btn start-btn">
                 Start Recording
              </button>
            ) : isPaused ? (
              <button onClick={handleStartRecording} disabled={loading} className="btn resume-btn">
                 Resume Recording
              </button>
            ) : (
              <>
                <button onClick={handleStopRecording} disabled={loading} className="btn stop-btn">
                Stop Recording
                </button>
                <button onClick={handlePauseRecording} disabled={loading} className="btn pause-btn">
                Pause Recording
                </button>
              </>
            )}
            {loading && <p className="loading-text">Processing Audio...</p>}
          </div>

          <div className="canvas-container">
            <canvas ref={canvasRef} className="waveform-canvas"></canvas>
          </div>

          {responseAudio && (
            <div className="audio-preview">
              <h3>Processed Audio</h3>
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
    body: JSON.stringify({ message }), // JSON message
  });
};


export default AudioUploader;
