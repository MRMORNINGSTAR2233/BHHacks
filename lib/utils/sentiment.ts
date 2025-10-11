import Sentiment from 'sentiment';

const sentimentAnalyzer = new Sentiment();

/**
 * Analyzes the emotional sentiment of user reaction text
 * @param reaction - The user's reaction text
 * @returns A normalized score between -1 (negative) and 1 (positive)
 */
export function analyzeSentiment(reaction: string): number {
  if (!reaction || reaction.trim() === '') {
    return 0; // Neutral for empty reactions
  }

  const result = sentimentAnalyzer.analyze(reaction);
  
  // Return the comparative score (normalized by word count)
  // This gives us a score typically between -1 and 1
  return result.comparative;
}
