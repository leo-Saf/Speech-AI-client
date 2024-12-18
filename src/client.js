export const uploadAudio = async (blob, userId, additionalParticipants = []) => {
  if (!userId) {
    throw new Error('Användar-ID saknas. Du måste vara inloggad.');
  }

  const formData = new FormData();
  formData.append('audio', blob, 'audio.webm'); // Lägg till Blob i FormData

  // Kombinera userId med eventuella ytterligare deltagare
  const combinedParticipants = [userId, ...additionalParticipants];

  // Serialisera participants array som en JSON-sträng
  formData.append('participants', JSON.stringify(combinedParticipants));

  try {
    const response = await fetch('/api/process-audio', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Fel vid uppladdning');
    }

    // Hantera svar som behövs (Blob eller JSON)
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const jsonResponse = await response.json();
      return JSON.stringify(jsonResponse); // Returnera JSON som en sträng
    } else {
      const audioBlob = await response.blob();
      return audioBlob; // Returnera bearbetat ljud som en Blob
    }
  } catch (error) {
    console.error('Ett fel inträffade vid uppladdningen:', error);
    throw error;
  }
};
