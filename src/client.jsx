import {SERVER_API_URL} from './URLs';

export const uploadAudio = async (blob) => {
  const formData = new FormData();
  formData.append('audio', blob, 'audio.webm'); // Lägg till Blob i FormData

  const response = await fetch(`${SERVER_API_URL}/api/process-audio` , {   
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Fel vid uppladdning');
  }

  return await response.blob(); // Returnera bearbetat ljud som Blob från servern
};

export const promptGPT = async (prompt) => {
  const response = await fetch(`${SERVER_API_URL}/api/prompt`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'}, 
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
      throw new Error('Response error');
    }

    const data = await response.json();
    return data;
};
