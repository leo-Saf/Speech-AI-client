export const uploadAudio = async (blob, userId) => {
  if (!userId) {
    // throw new Error('Användar-ID saknas. Du måste vara inloggad.');
  }

  const formData = new FormData();
  formData.append('audio', blob, 'audio.webm'); // Lägg till Blob i FormData
  formData.append('userId', userId);

  const response = await fetch('/api/process-audio', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Fel vid uppladdning');
  }

  const responseData = await response.json(); // Returnera JSON-från servern
  return JSON.stringify(responseData); // Returnera JSON som en sträng
};
