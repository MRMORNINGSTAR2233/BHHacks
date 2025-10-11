import Replicate from 'replicate';

let replicateClient: Replicate | null = null;

function getReplicateClient(): Replicate {
  if (!replicateClient) {
    const apiKey = process.env.REPLICATE_API_KEY;
    if (!apiKey) {
      throw new Error('REPLICATE_API_KEY environment variable is not set');
    }
    replicateClient = new Replicate({ auth: apiKey });
  }
  return replicateClient;
}

/**
 * Initiates async video generation using Replicate API
 * @param prompt - The augmented image prompt to use for video
 * @returns Prediction ID for client-side polling, or null on failure
 */
export async function generateVideoAsync(prompt: string): Promise<string | null> {
  try {
    const client = getReplicateClient();

    // Using a text-to-video model (adjust model as needed)
    const prediction = await client.predictions.create({
      version: 'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
      input: {
        prompt: prompt,
        num_frames: 24,
        num_inference_steps: 50,
      },
    });

    if (prediction.id) {
      console.log('[Hauntographer API] Video generation initiated:', {
        timestamp: new Date().toISOString(),
        predictionId: prediction.id,
      });
      return prediction.id;
    }

    return null;
  } catch (error) {
    console.error('[Hauntographer API] Video generation failed (graceful degradation):', {
      timestamp: new Date().toISOString(),
      errorType: 'VIDEO_FAILURE',
      endpoint: 'Replicate',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    
    // Graceful degradation - return null instead of throwing
    return null;
  }
}
