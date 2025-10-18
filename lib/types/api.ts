// Request Types
export interface StoryProfile {
  fears: string;
  genre: string;
}

export interface HistoryEntry {
  role: 'user' | 'model';
  content: string;
}

export interface GenerateRequest {
  storyProfile?: StoryProfile;
  storyHistory: HistoryEntry[];
  userReaction?: string | null;
}

// Response Types
export interface GenerateResponse {
  nextStoryChunk: string;
  choices: [string, string];
  imageUrl: string;
  updatedHistory: HistoryEntry[];
}

// LLM Response Type
export interface LLMResponse {
  story_chunk: string;
  image_prompt: string;
  choices: [string, string];
}

// Error Response Type
export interface ErrorResponse {
  error: string;
}

// Validation Result Type
export interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: GenerateRequest;
}
