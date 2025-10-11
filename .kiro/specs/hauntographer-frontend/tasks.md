# Implementation Plan

- [x] 1. Set up Next.js project structure and core dependencies

  - Initialize Next.js 14+ project with TypeScript and App Router
  - Install and configure Tailwind CSS with shadcn/ui
  - Set up project directory structure for components and styles
  - _Requirements: 4.1, 5.1, 5.2_

- [x] 2. Configure typography and design system foundation

  - Set up next/font with Special Elite and Inter fonts in app/layout.tsx
  - Create globals.css with CSS variables for the dark color palette
  - Configure Tailwind CSS with custom color scheme and font families
  - _Requirements: 4.2, 4.3, 4.4, 4.5_

- [x] 3. Install and configure shadcn/ui components

  - Install shadcn/ui CLI and initialize with dark theme
  - Add required components: Card, Button, Textarea, RadioGroup, Label, Skeleton, AspectRatio, Tooltip
  - Configure component styling to match cursed grimoire aesthetic
  - _Requirements: 4.1, 4.4, 4.5_

- [x] 4. Create core TypeScript interfaces and types

  - Define HorrorGenre, AppState, AppData, StorySegment types
  - Create API interfaces for StoryRequest and StoryResponse
  - Set up component prop interfaces for all major components
  - _Requirements: 1.1, 1.4, 2.1, 3.1_

- [x] 5. Implement SetupScreen component
- [x] 5.1 Create the setup screen layout and form structure

  - Build centered card layout with title and subtitle
  - Implement fears textarea with thematic placeholder text
  - Create radio group for horror genre selection
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 5.2 Add form validation and submission handling

  - Implement fear input validation (10-500 characters)
  - Add genre selection requirement validation
  - Create submit button with loading state and proper styling
  - _Requirements: 1.4, 1.5_

- [ ]\* 5.3 Write unit tests for SetupScreen component

  - Test form validation logic and error states
  - Test submission handling and loading states
  - Test accessibility features and keyboard navigation
  - _Requirements: 5.5_

- [ ] 6. Create TypewriterText component with animation

  - Implement character-by-character text animation using react-type-animation
  - Add configurable speed and completion callback functionality
  - Handle text formatting and line breaks properly
  - _Requirements: 6.1_

- [x] 7. Implement NarrativeScreen component structure
- [ ] 7.1 Create responsive two-column layout

  - Build desktop two-column layout (story left, image right)
  - Implement mobile single-column layout with proper stacking
  - Add responsive breakpoints and smooth transitions
  - _Requirements: 2.2, 5.1, 5.2_

- [ ] 7.2 Integrate story text display with typewriter effect

  - Connect TypewriterText component to story content
  - Handle story text updates and re-animation
  - Implement smooth content transitions between story segments
  - _Requirements: 2.1, 6.1_

- [ ] 7.3 Implement image display with loading states

  - Create AspectRatio container for consistent image sizing
  - Add Skeleton component for loading placeholder
  - Implement smooth fade-in transition when images load
  - _Requirements: 2.3, 2.4_

- [ ]\* 7.4 Write unit tests for NarrativeScreen component

  - Test responsive layout behavior at different breakpoints
  - Test image loading states and error handling
  - Test story text animation and transitions
  - _Requirements: 5.1, 5.2_

- [x] 8. Create interactive choice system
- [ ] 8.1 Implement choice buttons with styling and interactions

  - Create side-by-side button layout for story choices
  - Add hover effects with subtle glow and brightness increase
  - Implement proper button styling with primary color scheme
  - _Requirements: 3.1, 3.2_

- [ ] 8.2 Add choice selection and loading states

  - Handle choice button clicks with proper state management
  - Disable all buttons and show loading spinner on selected choice
  - Display atmospheric loading messages during API calls
  - _Requirements: 3.3, 3.4_

- [ ] 8.3 Implement optional reaction input system

  - Add subtle textarea below choice buttons for user reactions
  - Style reaction input to maintain visual hierarchy
  - Handle reaction data collection and integration
  - _Requirements: 7.1, 7.2, 7.4_

- [ ]\* 8.4 Write unit tests for choice interaction system

  - Test choice button interactions and loading states
  - Test reaction input functionality and validation
  - Test proper state management during choice selection
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 9. Implement main application state management
- [ ] 9.1 Create central state management for app phases

  - Implement state transitions between setup, narrative, and loading
  - Handle data persistence across different application states
  - Create proper state initialization and reset functionality
  - _Requirements: 1.5, 2.5, 3.5_

- [ ] 9.2 Integrate all components in main page component

  - Connect SetupScreen, NarrativeScreen, and loading states
  - Implement proper component mounting and unmounting
  - Handle data flow between different application phases
  - _Requirements: 1.5, 2.5, 3.5_

- [ ]\* 9.3 Write integration tests for state management

  - Test complete user flow from setup to narrative
  - Test state transitions and data persistence
  - Test error handling and recovery scenarios
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 10. Add animations and micro-interactions
- [ ] 10.1 Implement smooth transitions and fade effects

  - Add CSS transitions for content changes using framer-motion
  - Create smooth fade-out/fade-in for story content updates
  - Implement loading state transitions with proper timing
  - _Requirements: 6.2, 6.3_

- [ ] 10.2 Enhance button interactions and hover effects

  - Add subtle glow effects on button hover states
  - Implement smooth color transitions for interactive elements
  - Create loading spinner animations for choice buttons
  - _Requirements: 6.4_

- [ ]\* 10.3 Implement optional image glitch effects

  - Add momentary CSS glitch animation on image load
  - Create unsettling visual effects to enhance atmosphere
  - Ensure effects respect user motion preferences
  - _Requirements: 6.5_

- [x] 11. Implement accessibility features
- [ ] 11.1 Add proper ARIA labels and semantic HTML

  - Ensure all form elements have proper labels and descriptions
  - Add ARIA attributes for dynamic content updates
  - Implement proper heading hierarchy and landmark roles
  - _Requirements: 5.3, 5.5_

- [ ] 11.2 Implement keyboard navigation and focus management

  - Ensure logical tab order throughout the application
  - Add visible focus indicators for all interactive elements
  - Handle focus management during state transitions
  - _Requirements: 5.5_

- [x] 11.3 Add motion preference and color contrast support

  - Respect prefers-reduced-motion for animations
  - Ensure WCAG AA color contrast compliance
  - Provide alternative text for images and visual elements
  - _Requirements: 5.4, 6.5_

- [ ]\* 11.4 Write accessibility tests

  - Test keyboard navigation and screen reader compatibility
  - Validate ARIA attributes and semantic structure
  - Test color contrast and motion preference handling
  - _Requirements: 5.3, 5.4, 5.5_

- [ ] 12. Final integration and polish
- [ ] 12.1 Connect frontend to backend API endpoints

  - Implement API calls for story generation and image retrieval
  - Add proper error handling for network failures and timeouts
  - Handle API response parsing and data validation
  - _Requirements: 1.5, 2.1, 3.3_

- [ ] 12.2 Optimize performance and loading

  - Implement image optimization with Next.js Image component
  - Add proper loading states and skeleton placeholders
  - Optimize font loading and bundle size
  - _Requirements: 2.3, 2.4, 5.1_

- [ ] 12.3 Final styling and visual polish

  - Fine-tune spacing, typography, and visual hierarchy
  - Ensure consistent styling across all components and states
  - Add final atmospheric touches and visual refinements
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]\* 12.4 Write end-to-end tests
  - Test complete user journey from setup to story completion
  - Test error scenarios and edge cases
  - Validate performance and accessibility requirements
  - _Requirements: 1.1, 2.1, 3.1, 5.1_
