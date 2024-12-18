export const uploadAudio = async (blob, userId) => {
  // Använd 'guest' som fallback om userId saknas eller är tomt
  const effectiveUserId = userId && userId.trim() !== "" ? userId : "guest";

  console.log("UserId som används vid uppladdning:", effectiveUserId);

  // Skapa FormData med ljudblob och användar-ID
  const formData = new FormData();
  formData.append("audio", blob, "audio.webm"); // Lägg till Blob i FormData
  formData.append("userId", effectiveUserId); // Använd gäst-ID eller autentiserad användares ID

  try {
    const response = await fetch("/api/process-audio", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Fel vid uppladdning");
    }

    console.log("Uppladdningen lyckades för användar-ID:", effectiveUserId);
    return await response.blob(); // Returnera bearbetat ljud som Blob från servern
  } catch (error) {
    console.error("Ett fel inträffade vid uppladdningen:", error);
    throw error;
  }
};
