# UI Enhancement Requirements

## Introduction

Enhance the Hauntographer to have distinct visual experiences for Story Mode vs Game Mode, add atmospheric horror audio, and make Game Mode feel more like an actual game with interactive mechanics.

## Requirements

### Requirement 1: Distinct Visual Themes

**User Story:** As a user, I want Story Mode and Game Mode to look visually different, so that I can immediately tell which mode I'm in.

#### Acceptance Criteria

1. WHEN in Story Mode THEN the UI SHALL use a minimalist, book-like aesthetic
2. WHEN in Game Mode THEN the UI SHALL use a dark, game-like aesthetic with HUD elements
3. WHEN switching modes THEN the visual theme SHALL change immediately
4. WHEN in Story Mode THEN the layout SHALL be centered and clean
5. WHEN in Game Mode THEN the layout SHALL have game UI elements (health bar style fear meter, inventory-like timeline)

### Requirement 2: Background Horror Audio

**User Story:** As a user, I want atmospheric horror sounds playing in the background, so that I feel immersed in the horror experience.

#### Acceptance Criteria

1. WHEN the app starts THEN background horror music SHALL begin playing
2. WHEN the user clicks THEN audio SHALL be enabled (browser autoplay policy)
3. WHEN in Story Mode THEN subtle ambient sounds SHALL play
4. WHEN in Game Mode THEN more intense horror music SHALL play
5. WHEN fear level increases THEN music intensity SHALL increase
6. WHEN the user toggles audio THEN it SHALL mute/unmute
7. WHEN making choices THEN sound effects SHALL play

### Requirement 3: Game Mode Mechanics

**User Story:** As a user in Game Mode, I want actual game mechanics like inventory, health, and interactive elements, so that it feels like playing a game.

#### Acceptance Criteria

1. WHEN in Game Mode THEN the user SHALL have an inventory system
2. WHEN in Game Mode THEN items SHALL be collectible from story choices
3. WHEN in Game Mode THEN items SHALL be usable to affect outcomes
4. WHEN in Game Mode THEN a health/sanity bar SHALL be visible
5. WHEN fear reaches 100% THEN the game SHALL have consequences (game over or special ending)
6. WHEN in Game Mode THEN quick-time events MAY appear
7. WHEN in Game Mode THEN the UI SHALL resemble a game HUD

### Requirement 4: Story Mode Simplicity

**User Story:** As a user in Story Mode, I want a clean, distraction-free reading experience, so that I can focus on the narrative.

#### Acceptance Criteria

1. WHEN in Story Mode THEN NO game mechanics SHALL be visible
2. WHEN in Story Mode THEN the UI SHALL resemble an e-book reader
3. WHEN in Story Mode THEN only story text and choices SHALL be prominent
4. WHEN in Story Mode THEN images SHALL be displayed elegantly
5. WHEN in Story Mode THEN minimal UI elements SHALL be shown
