import type { StoryProfile, HistoryEntry } from '@/lib/types/api';

/**
 * Builds the master prompt for the LLM with all contextual data
 * @param profile - User's story profile (fears and genre)
 * @param history - Complete story history
 * @param emotionalScore - Optional sentiment score from user reaction
 * @returns Complete prompt string for the LLM
 */
export function buildMasterPrompt(
  profile: StoryProfile,
  history: HistoryEntry[],
  emotionalScore?: number
): string {
  // Format history as a readable string
  const historyString = history.length > 0
    ? JSON.stringify(history, null, 2)
    : '[]';

  // Determine sentiment interpretation
  const sentimentNote = emotionalScore !== undefined
    ? `const emotionalScore = ${emotionalScore.toFixed(2)};`
    : '// No user reaction provided';

  const prompt = `You are 'The Hauntographer', a master AI horror storyteller that generates interactive, personalized narratives. Your responses MUST be a single, valid JSON object and nothing else.

// --- User Profile ---
const userProfile = {
  fears: "${profile.fears}",
  genre: "${profile.genre}"
};

// --- Story Context ---
const storyHistory = ${historyString};

// --- User's Last Reaction ---
// (A negative score indicates fear/discomfort, positive indicates amusement/boredom)
${sentimentNote}

// --- Your Instructions ---
/*
1.  **Analyze the context:** Review the user's profile and the entire story history.
2.  **Adapt to Emotion:** ${emotionalScore !== undefined 
    ? emotionalScore <= 0 
      ? 'The user is engaged or frightened - maintain or escalate the current style of horror.'
      : 'The user seems amused or bored - you MUST pivot your narrative strategy. Introduce a different kind of scare, deepen the mystery, or build atmospheric dread instead of direct confrontation.'
    : 'No emotional feedback available - proceed with your best judgment based on the story context.'}
3.  **Write the Next Chapter:** Continue the story with 1-2 new paragraphs. The narrative MUST conform to the user's chosen genre "${profile.genre}" and incorporate their fears: "${profile.fears}".
4.  **Create Choices:** Conclude your story chunk with exactly two distinct, compelling choices for the user to make.
5.  **Generate an Image Prompt:** Create a highly descriptive, visceral, and cinematic prompt for an image generation model. This prompt must capture the peak moment of the chapter you just wrote.
*/

// --- Your Response (JSON ONLY) ---
{
  "story_chunk": "The text of the next part of the story...",
  "image_prompt": "A highly detailed, cinematic, ${profile.genre} style prompt for an image...",
  "choices": ["Choice A", "Choice B"]
}`;

  return prompt;
}
