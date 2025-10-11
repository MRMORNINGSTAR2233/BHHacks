// Core types for The Hauntographer application

export type HorrorGenre = 'Gothic' | 'Cosmic' | 'Slasher' | 'Psychological';

export type AppState = 'setup' | 'narrative' | 'loading';

export interface StorySegment {
  text: string;
  imageUrl?: string;
  choices: [string, string];
  userChoice?: string;
  userReaction?: string;
}

export interface AppData {
  fears: string;
  genre: HorrorGenre;
  currentStory: string;
  currentImage?: string;
  currentChoices: [string, string];
  storyHistory: StorySegment[];
}

// API interfaces
export interface StoryRequest {
  fears: string;
  genre: HorrorGenre;
  previousChoice?: string;
  userReaction?: string;
}

export interface StoryResponse {
  story_chunk: string;
  image_url?: string;
  choices: [string, string];
  is_complete: boolean;
}

// Component prop interfaces
export interface SetupScreenProps {
  onSubmit: (fears: string, genre: HorrorGenre) => void;
  isLoading: boolean;
}

export interface NarrativeScreenProps {
  storyChunk: string;
  imageUrl?: string;
  choices: [string, string];
  onChoiceSelect: (choice: string, reaction?: string) => void;
  isLoading: boolean;
  selectedChoice?: string;
}

export interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}