# Design Document

## Overview

This feature transforms the Hauntographer application into a dual-mode experience with a simple Story Mode and an enhanced Game Mode. It removes video generation entirely and adds gamification features including achievements, save/load, fear tracking, and visual enhancements.

## Architecture

### Mode System
- **Mode Selection Screen**: New initial screen for choosing Story/Game mode
- **Story Mode**: Existing simple narrative experience (minimal UI)
- **Game Mode**: Enhanced experience with all new features

### State Management
- Add `mode` field to AppData: `'story' | 'game'`
- Add `fearLevel` field (0-100)
- Add `achievements` array
- Add `statistics` object
- Use localStorage for persistence

## Components and Interfaces

### New Components

#### 1. ModeSelectionScreen
```typescript
interface ModeSelectionScreenProps {
  onModeSelect: (mode: 'story' | 'game') => void;
  hasSavedGame: boolean;
  onContinue?: () => void;
}
```

#### 2. EnhancedImage (already created)
- Replaces static images in Game Mode
- Includes parallax, fog, particles, grain effects

#### 3. FearMeter (already created)
```typescript
interface FearMeterProps {
  fearLevel: number;
  storyDepth: number;
}
```

#### 4. StoryTimeline (already created)
```typescript
interface TimelineEntry {
  text: string;
  choice?: string;
  imageUrl?: string;
}
```

#### 5. AchievementNotification
```typescript
interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}
```

#### 6. StatsPanel
```typescript
interface StatsPanelProps {
  stats: GameStatistics;
  achievements: Achievement[];
}

interface GameStatistics {
  choicesMade: number;
  fearLevel: number;
  timePlayed: number;
  achievementsUnlocked: number;
  storiesCompleted: number;
}
```

### Modified Components

#### NarrativeScreen
- Add `mode` prop
- Conditionally render Game Mode features
- Remove all video-related code
- Use EnhancedImage in Game Mode, regular Image in Story Mode

## Data Models

### AppData (Updated)
```typescript
interface AppData {
  mode: 'story' | 'game';
  fears: string;
  genre: HorrorGenre;
  currentStory: string;
  currentImage: string | undefined;
  currentChoices: [string, string];
  storyHistory: StorySegment[];
  
  // Game Mode only
  fearLevel?: number;
  achievements?: Achievement[];
  statistics?: GameStatistics;
  startTime?: number;
}
```

### SaveData
```typescript
interface SaveData {
  version: string;
  savedAt: Date;
  appData: AppData;
}
```

## Logic Flow

### Mode Selection Flow
1. App starts → Show ModeSelectionScreen
2. Check localStorage for saved game
3. If saved game exists → Show "Continue" button
4. User selects mode → Store in state
5. Navigate to SetupScreen

### Fear Level Calculation
```typescript
function calculateFearLevel(
  currentLevel: number,
  storyContent: string,
  choiceType: string
): number {
  let increase = 5; // Base increase per choice
  
  // Analyze story content for fear keywords
  const fearKeywords = ['scream', 'blood', 'death', 'terror', 'darkness'];
  const keywordCount = fearKeywords.filter(kw => 
    storyContent.toLowerCase().includes(kw)
  ).length;
  
  increase += keywordCount * 2;
  
  // Cap at 100
  return Math.min(100, currentLevel + increase);
}
```

### Achievement System
```typescript
const ACHIEVEMENTS = [
  {
    id: 'brave_explorer',
    title: 'Brave Explorer',
    description: 'Complete 5 story segments',
    icon: '🎖️',
    condition: (stats) => stats.choicesMade >= 5
  },
  {
    id: 'fearless',
    title: 'Fearless',
    description: 'Reach 100% fear level',
    icon: '💀',
    condition: (stats) => stats.fearLevel >= 100
  },
  {
    id: 'decision_maker',
    title: 'Decision Maker',
    description: 'Make 10 choices',
    icon: '🎯',
    condition: (stats) => stats.choicesMade >= 10
  },
  {
    id: 'survivor',
    title: 'Survivor',
    description: 'Complete a full story',
    icon: '🏆',
    condition: (stats) => stats.storiesCompleted >= 1
  }
];
```

### Save/Load System
```typescript
// Save
function saveGame(appData: AppData): void {
  const saveData: SaveData = {
    version: '1.0.0',
    savedAt: new Date(),
    appData
  };
  localStorage.setItem('hauntographer_save', JSON.stringify(saveData));
}

// Load
function loadGame(): AppData | null {
  const saved = localStorage.getItem('hauntographer_save');
  if (!saved) return null;
  
  const saveData: SaveData = JSON.parse(saved);
  return saveData.appData;
}

// Check if save exists
function hasSavedGame(): boolean {
  return localStorage.getItem('hauntographer_save') !== null;
}
```

## Error Handling

- If localStorage is unavailable, disable save/load features
- If saved data is corrupted, show error and start fresh
- If mode is invalid, default to Story Mode

## Testing Strategy

### Unit Tests
- Fear level calculation logic
- Achievement unlock conditions
- Save/load serialization

### Integration Tests
- Mode selection flow
- Game Mode feature integration
- Achievement notifications

### Manual Testing
- Test both modes work independently
- Verify save/load across browser sessions
- Check achievement unlocks at correct times
- Ensure fear meter updates correctly
