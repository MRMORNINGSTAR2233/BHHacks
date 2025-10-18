/**
 * Generates atmospheric horror audio using ElevenLabs API
 * @param text - The story text to narrate
 * @param mood - The mood/atmosphere (tense, eerie, terrifying)
 * @returns Audio URL or null on failure
 */
export async function generateNarrationAudio(
  text: string
): Promise<string | null> {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.warn("ELEVENLABS_API_KEY not set, skipping audio generation");
      return null;
    }

    // Use a deep, ominous voice
    const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel - can be changed

    console.log("[Hauntographer API] Generating narration audio");

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    // Convert audio blob to base64 data URL
    const audioBlob = await response.blob();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${base64}`;

    console.log("[Hauntographer API] Audio generation successful");
    return audioUrl;
  } catch (error) {
    console.error("[Hauntographer API] Audio generation failed:", error);
    return null;
  }
}

/**
 * Gets ambient horror sound effect based on scene type
 * @param sceneType - Type of scene (forest, mansion, cemetery, etc.)
 * @returns Sound effect identifier
 */
export function getAmbientSound(sceneType: string): string {
  const soundMap: Record<string, string> = {
    forest: 'wind-trees',
    mansion: 'creaking-doors',
    cemetery: 'distant-thunder',
    basement: 'dripping-water',
    default: 'eerie-ambience',
  };

  return soundMap[sceneType.toLowerCase()] || soundMap.default;
}
