import React, { useState, useEffect } from 'react';
import { uploadAudio } from '../client'; // Importera client.js

const AudioUploader = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [responseAudio, setResponseAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const MAX_RECORDING_TIME = 5000; // 5 sekunder for now
  let recordingTimeout = null;

  useEffect(() => {
    const setupRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
        // Kontrollera om 'audio/webm' stöds av webbläsaren
        let options = { mimeType: 'audio/webm' };
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          console.warn('audio/webm stöds inte. Försöker använda audio/wav istället.');
          options = { mimeType: 'audio/wav' }; // fallback om webm inte stöds
        }

        const recorder = new MediaRecorder(stream, options); 
        setMediaRecorder(recorder);
        console.log("MediaRecorder set up successfully");
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
    console.log("recording started");

    const audioChunks = [];
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); // Spara ljudet som .webm
      console.log("recording stopped, processing audio");
      setAudioBlob(audioBlob);
      setIsRecording(false);

      // Automatisk uppladdning av ljudfil
      await handleUpload(audioBlob);
    };

    // avslutar recording efter MAX_RECORDING_TIME 
    recordingTimeout = setTimeout(() => {
      console.log("auto sttop triggered after timeout");
      handleStopRecording();
    }, MAX_RECORDING_TIME);
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      console.log("stopping recording via handleStopRecording");
      clearTimeout(recordingTimeout);
    } else {
      console.log("mediaRecorder is not in recording state:", mediaRecorder.state);
    }
  };

  const handleUpload = async (blob) => {
    if (!blob) {
      alert('Vänligen spela in ett ljud först.');
      return;
    }

    setLoading(true);
    console.log("uploading audio...");

    try {
      const audioBlobResponse = await uploadAudio(blob); // Anropa backend via client.js
      const audioURL = URL.createObjectURL(audioBlobResponse);
      setResponseAudio(audioURL);
      console.log("audio uploaded and response received");
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
