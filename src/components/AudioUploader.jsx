import React, { useState, useEffect, useRef } from 'react';
import { uploadAudio } from '../client';  // Importera client.js

const AudioUploader = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [responseAudio, setResponseAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null); // ref till audio element
  const MAX_RECORDING_TIME = 5000; // 5 sekunder for now
  let recordingTimeout = null;

  useEffect(() => {
    const setupRecorder = async () => {
      if (!window.MediaRecorder) {
        alert('Din webbläsare stöder inte ljudinspelning.');
        return;
      }
  
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      setAudioBlob(audioBlob);
      setIsRecording(false);

      // automatiskt laddaupp filen
      await handleUpload(audioBlob);
    };

    recordingTimeout = setTimeout(() => {
      handleStopRecording();
    }, MAX_RECORDING_TIME);
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      clearTimeout(recordingTimeout);
    }
  };

  const handleUpload = async (blob) => {
    if (!blob) {
      console.warn("no audio to upload.");
      return;
    }

    setLoading(true);

    try {
      const audioBlobResponse = await uploadAudio(blob);  // Anropa backend via client.js
      const audioURL = URL.createObjectURL(audioBlobResponse);
      setResponseAudio(audioURL);
    } catch (error) {
      console.error('Fel vid uppladdning:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // spela responsen automatiskt när det går / den är avaialble
    if (responseAudio && audioRef.current) {
      audioRef.current.play();
    }
  }, [responseAudio]); // körs varje gång `responseAudio` ändras

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
          <audio ref={audioRef} src={responseAudio} controls></audio>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
