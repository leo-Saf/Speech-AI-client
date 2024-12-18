<<<<<<< Updated upstream
//src/client.js
=======
export const uploadAudio = async (blob, userId) => {
  // Använd 'guest' som fallback om userId saknas eller är tomt
  const effectiveUserId = userId && userId.trim() !== "" ? userId : null;
>>>>>>> Stashed changes

export const uploadAudio = async (audioBlob, userId) => {
  if (!userId) {
    throw new Error('Användar-ID saknas. Du måste vara inloggad.');
  }
  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.webm'); 
  formData.append('userId', userId);

  const response = await fetch('/api/process-audio', {

    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Fel vid uppladdning');
  }

  return await response.blob(); // Returnera bearbetat ljud som Blob från servern
};