// Function to upload audio (Blob) with additional participants
export const uploadAudio = async (blob, userId, additionalParticipants = []) => {
  // Check if the user is authenticated
  if (!userId) {
    //throw new Error('User ID is missing. You must be logged in.');
  }

  const formData = new FormData(); // Create a new FormData object
  formData.append('audio', blob, 'audio.webm'); // Append the audio Blob to the FormData

  // Combine the userId with any additional participants
  const combinedParticipants = [userId, ...additionalParticipants];

  // Serialize the participants array into a JSON string and append it to FormData
  formData.append('participants', JSON.stringify(combinedParticipants));

  try {
     // Send the audio and participants data to the backend API (changed path to /api/process-audio)
    const response = await fetch('/api/process-audio', { 
      method: 'POST',
      body: formData, // Send the form data with audio and participants
    });

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error('Error during upload');
    }

     // Handle the response based on its content type
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
       // If the response is JSON, parse it and return it as a string
      const jsonResponse = await response.json();
      return JSON.stringify(jsonResponse); // Return the JSON data as a string
    } else {
       // If the response contains audio data (Blob), return it
      const audioBlob = await response.blob();
      return audioBlob; // Return the processed audio as a Blob
    }
  } catch (error) {
    console.error('An error occurred during upload:', error); // Log any errors to the console
    throw error; // Rethrow the error to propagate it
  }
};
