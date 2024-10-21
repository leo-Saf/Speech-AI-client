import React, { useState, useEffect } from 'react';
import { uploadAudio } from '../client'; // Importera client.js

const AudioUploader = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [responseAudio, setResponseAudio] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setupRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' }); // Använder audio/webm format
        setMediaRecorder(recorder);
      } catch (error) {
        console.error('Fel vid åtkomst till mikrofonen:', error);
      }
    };

    setupRecorder();
  }, []);

  const handleStartRecording = () => {
    if (!mediaRecorder) return;

    mediaRecorder.start();
    setIsRecording(true);

    const audioChunks = [];
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); // Spara ljudet som .webm
      setAudioBlob(audioBlob);
      setIsRecording(false);

      // Automatisk uppladdning av ljudfil
      await handleUpload(audioBlob);
    };
  };

  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
  };

  const handleUpload = async (blob) => {
    if (!blob) {
      alert('Vänligen spela in ett ljud först.');
      return;
    }

    setLoading(true);

    try {
      const audioBlobResponse = await uploadAudio(blob); // Anropa backend via client.js
      const audioURL = URL.createObjectURL(audioBlobResponse);
      setResponseAudio(audioURL);
    } catch (error) {
      console.error('Fel vid uppladdning:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Spela in ett ljud</h2>

      {!isRecording ? (
        <button onClick={handleStartRecording} disabled={loading}>
          Starta inspelning
        </button>
      ) : (
        <button onClick={handleStopRecording} disabled={loading}>
          Stoppa inspelning
        </button>
      )}

      <br />
      {loading && <p>Bearbetar ljud...</p>}

      {responseAudio && (
        <div>
          <h3>Bearbetat ljud</h3>
          <audio controls src={responseAudio}></audio>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
