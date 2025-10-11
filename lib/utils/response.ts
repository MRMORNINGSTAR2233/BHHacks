import type { LLMResponse, GenerateResponse, HistoryEntry } from '@/lib/types/api';

/**
 * Assembles the final API response with all generated content
 * @param llmResponse - Response from the LLM with story and choices
 * @param imageUrl - URL of the generated image
 * @param videoId - Optional video prediction ID
 * @param history - Current story history
 * @returns Complete API response object
 */
export function assembleResponse(
  llmResponse: LLMResponse,
  imageUrl: string,
  videoId: string | null,
  history: HistoryEntry[]
): GenerateResponse {
  // Update history with the new model response
  const updatedHistory: HistoryEntry[] = [
    ...history,
    {
      role: 'model',
      content: llmResponse.story_chunk,
    },
  ];

  return {
    nextStoryChunk: llmResponse.story_chunk,
    choices: llmResponse.choices,
    visuals: {
      imageUrl,
      videoId,
    },
    updatedHistory,
  };
}
