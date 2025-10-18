# Implementation Plan

- [x] 1. Remove video generation code
  - Remove video-related fields from types
  - Remove video generation API calls
  - Remove video UI components
  - Clean up environment variables
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. Create utility functions and types
  - [x] 2.1 Create achievement definitions and logic
    - Define achievement constants
    - Implement achievement check function
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [x] 2.2 Create save/load utilities
    - Implement saveGame function
    - Implement loadGame function
    - Implement hasSavedGame check
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 2.3 Create fear level calculator
    - Implement fear level calculation logic
    - Add keyword analysis
    - _Requirements: 3.5_
  
  - [x] 2.4 Update AppData types
    - Add mode field
    - Add fearLevel field
    - Add achievements array
    - Add statistics object
    - _Requirements: 1.2, 1.3, 3.1, 4.5, 6.1_

- [x] 3. Create new UI components
  - [x] 3.1 Create ModeSelectionScreen component
    - Design mode selection UI
    - Add Story Mode button
    - Add Game Mode button
    - Add Continue button (conditional)
    - _Requirements: 1.1, 1.2, 1.3, 5.2_
  
  - [x] 3.2 Create AchievementNotification component
    - Design notification popup
    - Add animation
    - Add auto-dismiss
    - _Requirements: 4.4_
  
  - [x] 3.3 Create StatsPanel component
    - Display all statistics
    - Show achievements
    - Add visual styling
    - _Requirements: 6.2, 6.3_

- [x] 4. Update existing components
  - [x] 4.1 Update NarrativeScreen for dual mode
    - Add mode prop
    - Conditionally render Game Mode features
    - Integrate EnhancedImage for Game Mode
    - Integrate FearMeter for Game Mode
    - Integrate StoryTimeline for Game Mode
    - Remove all video code
    - _Requirements: 1.2, 1.3, 2.3, 3.1, 3.2, 3.3_
  
  - [x] 4.2 Update SetupScreen
    - Add back button to mode selection
    - _Requirements: 1.4_

- [x] 5. Update main App component (page.tsx)
  - [x] 5.1 Add mode selection state
    - Add appState for 'modeSelection'
    - Update state machine
    - _Requirements: 1.1_
  
  - [x] 5.2 Integrate save/load system
    - Check for saved game on mount
    - Add save functionality
    - Add load functionality
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [x] 5.3 Implement fear level tracking
    - Calculate fear on each choice
    - Update state
    - _Requirements: 3.1, 3.5_
  
  - [x] 5.4 Implement achievement system
    - Check achievements after each action
    - Show notifications
    - Store unlocked achievements
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 5.5 Implement statistics tracking
    - Track choices made
    - Track time played
    - Track achievements
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 6. Clean up and polish
  - Remove unused video files
  - Update environment variable documentation
  - Add transitions and animations
  - Test both modes thoroughly
  - _Requirements: 2.1, 2.2, 2.3, 2.4_
