import React, { useState, useEffect, useRef } from 'react';
import { uploadAudio } from '../client';
import { useLanguage } from './LanguageContext';

const AudioUploader = ({ userId }) => {
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const { selectedLanguage, isRecording, setIsRecording, isPaused, setIsPaused } = useLanguage();
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [responseAudio, setResponseAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const microphoneRef = useRef(null);

  const MAX_SILENCE_TIME = 3000;
  const SILENCE_THRESHOLD = 30;
  const MAX_RECORDING_TIME = 15000;
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

        console.log('User ID = ', userId);
      } catch (error) {
        console.error('Error accessing the microphone:', error);
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
            handleStopRecording();
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
    if (!selectedLanguage) {
      alert('Please select a language before starting the session');
      return;
    }
    console.log('userid = ', userId);
    setIsConversationStarted(true);
  };

  const handleStopConversation = async () => {
    console.log('Stopping conversation for user: ', userId);
    setIsConversationStarted(false);
    setIsRecording(false);
    setIsPaused(false);
    clearTimeout(silenceTimeout);
    await sendMessageToServer('end-conversation');
  };

  const handleStartRecording = () => {
    if (!selectedLanguage) {
      alert('Please select a language before starting recording');
      return;
    }
    if (!mediaRecorder) return;
  
    if (isPaused) {
      mediaRecorder.resume();
      setIsPaused(false);
    } else if (!isRecording) { // Kontrollera att inspelningen inte redan har startat
      mediaRecorder.start();
      setIsRecording(true);
      silenceHistory.length = 0;
  
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

      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
        recordingTimeoutRef.current = null;
      }

      console.log('Recording stopped manually OR by timer.');
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
      const uploadId = userId;
      console.log('Uploading audio with ID:', uploadId);
      console.log('Data being sent to backend:', blob);

      const response = await uploadAudio(blob, uploadId);
      
      console.log('Upload successful:', response);
      const audioURL = URL.createObjectURL(response);
      setResponseAudio(audioURL);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload error: ${error.message}`);
    } finally {
      setLoading(false);
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
  }, [responseAudio]);

  return (
    <div className="audio-uploader">
      {!isConversationStarted ? (
        <button
          onClick={handleStartConversation}
          disabled={!selectedLanguage}
          className={`btn start-conversation-btn ${!selectedLanguage ? 'disabled' : ''}`}
        >
          {selectedLanguage ? 'Start Session' : 'Please select a language first'}
        </button>
      ) : (
        <>
          <button
            onClick={handleStopConversation}
            className="btn stop-conversation-btn"
          >
            Stop Session
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
    body: JSON.stringify({ message }),
  });
};

export default AudioUploader;