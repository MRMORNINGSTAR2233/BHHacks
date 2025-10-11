import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMResponse } from '@/lib/types/api';

let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Generates narrative content using Google Gemini API
 * @param prompt - The master prompt with all context
 * @returns LLM response with story_chunk, image_prompt, and choices
 * @throws Error if API call fails or response is malformed
 */
export async function generateNarrative(prompt: string): Promise<LLMResponse> {
  const client = getGeminiClient();
  
  // Use gemini-1.5-flash for faster responses (can switch to gemini-1.5-pro for better quality)
  const model = client.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  });

  let attempt = 0;
  const maxAttempts = 2;

  while (attempt < maxAttempts) {
    attempt++;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Parse JSON response
      let parsedResponse: unknown;
      try {
        parsedResponse = JSON.parse(text);
      } catch (parseError) {
        console.error('[Hauntographer API] Failed to parse LLM response as JSON:', {
          timestamp: new Date().toISOString(),
          attempt,
          error: parseError,
          responseText: text.substring(0, 200),
        });
        
        if (attempt < maxAttempts) {
          console.log('[Hauntographer API] Retrying LLM call...');
          continue;
        }
        
        throw new Error('LLM returned non-JSON response after retry');
      }

      // Validate response structure
      if (!isValidLLMResponse(parsedResponse)) {
        console.error('[Hauntographer API] LLM response missing required keys:', {
          timestamp: new Date().toISOString(),
          attempt,
          response: parsedResponse,
        });
        
        if (attempt < maxAttempts) {
          console.log('[Hauntographer API] Retrying LLM call...');
          continue;
        }
        
        throw new Error('LLM response missing required keys after retry');
      }

      return parsedResponse as LLMResponse;
    } catch (error) {
      console.error('[Hauntographer API] LLM API call failed:', {
        timestamp: new Date().toISOString(),
        attempt,
        errorType: 'LLM_FAILURE',
        endpoint: 'Google Gemini',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (attempt < maxAttempts && error instanceof Error && error.message.includes('response')) {
        // Only retry for response-related errors
        continue;
      }

      throw error;
    }
  }

  throw new Error('LLM generation failed after all attempts');
}

function isValidLLMResponse(response: unknown): boolean {
  if (!response || typeof response !== 'object') {
    return false;
  }

  const r = response as Record<string, unknown>;
  
  return (
    typeof r.story_chunk === 'string' &&
    typeof r.image_prompt === 'string' &&
    Array.isArray(r.choices) &&
    r.choices.length === 2 &&
    typeof r.choices[0] === 'string' &&
    typeof r.choices[1] === 'string'
  );
}
