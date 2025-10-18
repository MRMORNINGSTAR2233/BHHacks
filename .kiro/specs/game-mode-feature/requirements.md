# Requirements Document

## Introduction

This feature adds a dual-mode experience to the Hauntographer horror story application, allowing users to choose between a simple "Story Mode" (existing experience) and an enhanced "Game Mode" with gamification features, visual effects, and progress tracking.

## Requirements

### Requirement 1: Mode Selection

**User Story:** As a user, I want to choose between Story Mode and Game Mode at the start, so that I can select my preferred experience level.

#### Acceptance Criteria

1. WHEN the user starts the application THEN they SHALL see a mode selection screen before the setup screen
2. WHEN the user selects "Story Mode" THEN they SHALL experience the current simple narrative experience
3. WHEN the user selects "Game Mode" THEN they SHALL experience enhanced features including fear meter, timeline, and visual effects
4. IF the user is in the setup screen THEN they SHALL be able to go back to mode selection

### Requirement 2: Remove Video Generation

**User Story:** As a developer, I want to completely remove video generation code, so that the application is simpler and more reliable.

#### Acceptance Criteria

1. WHEN video generation code is removed THEN the application SHALL NOT make any video API calls
2. WHEN the API response is assembled THEN it SHALL NOT include videoId field
3. WHEN the narrative screen renders THEN it SHALL NOT display video-related UI elements
4. WHEN environment variables are checked THEN video API keys SHALL be removed

### Requirement 3: Game Mode Features

**User Story:** As a user playing in Game Mode, I want to see my fear level, story timeline, and enhanced visuals, so that I feel more engaged with the story.

#### Acceptance Criteria

1. WHEN in Game Mode THEN the fear meter SHALL display and update based on story progression
2. WHEN in Game Mode THEN the story timeline SHALL show all previous choices and segments
3. WHEN in Game Mode THEN images SHALL have atmospheric effects (parallax, fog, particles)
4. WHEN fear level exceeds 80% THEN a warning message SHALL appear
5. WHEN the user makes choices THEN the fear level SHALL increase appropriately

### Requirement 4: Achievement System

**User Story:** As a user in Game Mode, I want to unlock achievements, so that I feel rewarded for my progress.

#### Acceptance Criteria

1. WHEN the user completes 5 story segments THEN they SHALL unlock "Brave Explorer" achievement
2. WHEN the user's fear level reaches 100% THEN they SHALL unlock "Fearless" achievement
3. WHEN the user makes 10 choices THEN they SHALL unlock "Decision Maker" achievement
4. WHEN an achievement is unlocked THEN a notification SHALL appear
5. WHEN the user views their profile THEN all unlocked achievements SHALL be displayed

### Requirement 5: Save/Load System

**User Story:** As a user, I want to save my progress and load it later, so that I can continue my story across sessions.

#### Acceptance Criteria

1. WHEN the user clicks "Save Progress" THEN their current story state SHALL be saved to localStorage
2. WHEN the user returns to the app THEN they SHALL see an option to "Continue Story" if a save exists
3. WHEN the user clicks "Continue Story" THEN their previous state SHALL be restored
4. WHEN the user starts a new story THEN they SHALL be warned if it will overwrite existing progress
5. IF no save exists THEN the "Continue Story" option SHALL NOT be displayed

### Requirement 6: Story Statistics

**User Story:** As a user in Game Mode, I want to see my story statistics, so that I can track my gameplay.

#### Acceptance Criteria

1. WHEN in Game Mode THEN statistics SHALL track: choices made, fear level, time played, achievements unlocked
2. WHEN the user views stats THEN they SHALL see all tracked metrics
3. WHEN the story ends THEN final statistics SHALL be displayed
4. WHEN statistics are calculated THEN they SHALL persist across sessions
