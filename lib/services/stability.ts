/**
 * Augments the base image prompt with cinematic and stylistic keywords
 * @param basePrompt - The image prompt from the LLM
 * @param genre - The horror genre for style-specific keywords
 * @returns Augmented prompt with styling keywords
 */
export function augmentImagePrompt(basePrompt: string, genre: string): string {
  const styleKeywords = [
    'cinematic horror',
    'ultra-realistic',
    'dramatic lighting',
    'high contrast',
    'atmospheric',
    `${genre} style`,
    '4k quality',
    'professional photography',
  ];

  return `${basePrompt}, ${styleKeywords.join(', ')}`;
}

/**
 * Generates an image using Stability AI API
 * @param prompt - The augmented image prompt
 * @returns Direct URL to the generated image
 * @throws Error if API call fails
 */
export async function generateImage(prompt: string): Promise<string> {
  const apiKey = process.env.STABILITY_API_KEY;
  
  if (!apiKey) {
    throw new Error('STABILITY_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1,
            },
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Hauntographer API] Stability AI API error:', {
        timestamp: new Date().toISOString(),
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Stability AI API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Extract the base64 image and convert to data URL
    if (data.artifacts && data.artifacts.length > 0 && data.artifacts[0].base64) {
      const base64Image = data.artifacts[0].base64;
      return `data:image/png;base64,${base64Image}`;
    }

    throw new Error('Stability AI response missing image data');
  } catch (error) {
    console.error('[Hauntographer API] Image generation failed:', {
      timestamp: new Date().toISOString(),
      errorType: 'IMAGE_FAILURE',
      endpoint: 'Stability AI',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
