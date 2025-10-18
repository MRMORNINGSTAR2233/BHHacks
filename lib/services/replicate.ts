import Replicate from "replicate";

let replicateClient: Replicate | null = null;

function getReplicateClient(): Replicate {
  if (!replicateClient) {
    const apiKey = process.env.REPLICATE_API_KEY;
    if (!apiKey) {
      throw new Error("REPLICATE_API_KEY environment variable is not set");
    }
    replicateClient = new Replicate({
      auth: apiKey,
    });
  }
  return replicateClient;
}

/**
 * Initiates async video generation using Stable Video Diffusion
 * @param imageUrl - The image URL to animate (base64 or external URL)
 * @returns Video URL or null on failure
 */
export async function generateVideoAsync(
  imageUrl: string
): Promise<string | null> {
  try {
    const replicate = getReplicateClient();

    console.log(
      "[Hauntographer API] Initiating Stable Video Diffusion generation:",
      {
        timestamp: new Date().toISOString(),
        imageType: imageUrl.startsWith("data:") ? "base64" : "url",
      }
    );

    // Using Stable Video Diffusion to animate the generated image
    const output = (await replicate.run(
      "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
      {
        input: {
          input_image: imageUrl,
          sizing_strategy: "maintain_aspect_ratio",
          frames_per_second: 6,
          motion_bucket_id: 127, // Higher values = more motion (1-255)
          cond_aug: 0.02, // Conditioning augmentation (0.0-1.0)
        },
      }
    )) as string | string[] | unknown;

    // Replicate returns the video URL directly (usually as a string)
    if (typeof output === "string") {
      console.log("[Hauntographer API] Video generation successful:", {
        timestamp: new Date().toISOString(),
        videoUrl: output.substring(0, 100),
      });
      return output;
    } else if (
      Array.isArray(output) &&
      output.length > 0 &&
      typeof output[0] === "string"
    ) {
      // Sometimes Replicate returns an array of URLs
      const videoUrl = output[0];
      console.log("[Hauntographer API] Video generation successful:", {
        timestamp: new Date().toISOString(),
        videoUrl: videoUrl.substring(0, 100),
      });
      return videoUrl;
    } else {
      console.warn(
        "[Hauntographer API] Video generation returned unexpected format:",
        {
          timestamp: new Date().toISOString(),
          output: output,
        }
      );
      return null;
    }
  } catch (error) {
    console.error(
      "[Hauntographer API] Video generation failed (graceful degradation):",
      {
        timestamp: new Date().toISOString(),
        errorType: "VIDEO_FAILURE",
        endpoint: "Stable Video Diffusion",
        message: error instanceof Error ? error.message : "Unknown error",
      }
    );

    // Graceful degradation - return null instead of throwing
    return null;
  }
}
