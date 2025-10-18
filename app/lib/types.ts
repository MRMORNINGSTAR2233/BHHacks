// Core types for The Hauntographer application

export type HorrorGenre = 'Gothic' | 'Cosmic' | 'Slasher' | 'Psychological';

export type AppState = 'modeSelection' | 'setup' | 'narrative' | 'loading';

export type GameMode = 'story' | 'game';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface GameStatistics {
  choicesMade: number;
  fearLevel: number;
  timePlayed: number;
  achievementsUnlocked: number;
  storiesCompleted: number;
}

export interface StorySegment {
  text: string;
  imageUrl?: string;
  choices: [string, string];
  userChoice?: string;
  userReaction?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  usable: boolean;
}

export interface AppData {
  mode: GameMode;
  fears: string;
  genre: HorrorGenre;
  currentStory: string;
  currentImage?: string;
  currentChoices: [string, string];
  storyHistory: StorySegment[];
  
  // Game Mode only
  gameCode?: string; // Generated game HTML/CSS/JS
  gameState?: unknown; // Current game state
  fearLevel?: number;
  health?: number; // 0-100
  sanity?: number; // 0-100
  inventory?: InventoryItem[];
  achievements?: Achievement[];
  statistics?: GameStatistics;
  startTime?: number;
}

export interface SaveData {
  version: string;
  savedAt: Date;
  appData: AppData;
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
  onBack?: () => void;
}

export interface NarrativeScreenProps {
  mode: GameMode;
  storyChunk: string;
  imageUrl?: string;
  choices: [string, string];
  onChoiceSelect: (choice: string, reaction?: string) => void;
  isLoading: boolean;
  selectedChoice?: string;
  fearLevel?: number;
  health?: number;
  sanity?: number;
  inventory?: InventoryItem[];
  storyHistory?: StorySegment[];
  onSave?: () => void;
  onUseItem?: (itemId: string) => void;
}

export interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}