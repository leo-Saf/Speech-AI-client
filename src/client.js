export const uploadAudio = async (blob, userId, participants = []) => {
  if (!userId) {
    throw new Error('Användar-ID saknas. Du måste vara inloggad.');
  }

  const formData = new FormData();
  formData.append('audio', blob, 'audio.webm'); // Add the Blob to the FormData
  formData.append('userId', userId);

  // Serialize the participants array as a JSON string
  if (participants.length > 0) {
    formData.append('participants', JSON.stringify(participants));
  }

  const response = await fetch('/api/process-audio', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Fel vid uppladdning');
  }

  // Handle response as needed (Blob or JSON)
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    const jsonResponse = await response.json();
    return JSON.stringify(jsonResponse); // Return JSON as a string
  } else {
    const audioBlob = await response.blob();
    return audioBlob; // Return processed audio as a Blob
  }
};
