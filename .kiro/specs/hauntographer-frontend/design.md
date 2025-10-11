# Design Document - The Hauntographer Frontend

## Overview

The Hauntographer frontend is a Next.js application that creates an immersive horror experience through a "cursed grimoire" aesthetic. The application follows a single-page architecture with multiple states, emphasizing atmospheric design, smooth animations, and accessibility. The design prioritizes content-first presentation while maintaining the dark, literary atmosphere essential to the horror experience.

## Architecture

### Technology Stack
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Typography**: next/font with Google Fonts (Special Elite) and Inter
- **Animations**: react-type-animation for typewriter effects, framer-motion for transitions
- **Icons**: lucide-react
- **State Management**: React useState for local component state
- **Image Handling**: Next.js Image component with aspect ratio containers

### Project Structure
```
app/
├── layout.tsx          # Root layout with font configuration
├── page.tsx           # Main application page with state management
├── globals.css        # Global styles and CSS variables
└── components/
    ├── ui/            # shadcn/ui components
    ├── setup-screen.tsx
    ├── narrative-screen.tsx
    ├── loading-state.tsx
    └── typewriter-text.tsx
```

## Components and Interfaces

### Core Components

#### SetupScreen Component
```typescript
interface SetupScreenProps {
  onSubmit: (fears: string, genre: HorrorGenre) => void;
  isLoading: boolean;
}

type HorrorGenre = 'Gothic' | 'Cosmic' | 'Slasher' | 'Psychological';
```

**Responsibilities:**
- Render the initial "ritual" interface
- Handle fear input validation
- Manage genre selection
- Trigger narrative generation

**Key Features:**
- Centered card layout
- Thematic placeholder text
- Form validation
- Loading state management

#### NarrativeScreen Component
```typescript
interface NarrativeScreenProps {
  storyChunk: string;
  imageUrl?: string;
  choices: [string, string];
  onChoiceSelect: (choice: string, reaction?: string) => void;
  isLoading: boolean;
  selectedChoice?: string;
}
```

**Responsibilities:**
- Display story text with typewriter animation
- Handle image loading and display
- Present interactive choices
- Manage optional reaction input
- Handle loading states during transitions

**Layout:**
- Two-column desktop layout (story left, image right)
- Single-column mobile layout (story top, image bottom)
- Responsive breakpoints at 768px

#### TypewriterText Component
```typescript
interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}
```

**Responsibilities:**
- Animate text appearance character by character
- Provide completion callback for chaining animations
- Handle text formatting and line breaks

### State Management

#### Application State
```typescript
type AppState = 'setup' | 'narrative' | 'loading';

interface AppData {
  fears: string;
  genre: HorrorGenre;
  currentStory: string;
  currentImage?: string;
  currentChoices: [string, string];
  storyHistory: StorySegment[];
}

interface StorySegment {
  text: string;
  imageUrl?: string;
  choices: [string, string];
  userChoice?: string;
  userReaction?: string;
}
```

## Data Models

### API Integration
```typescript
interface StoryRequest {
  fears: string;
  genre: HorrorGenre;
  previousChoice?: string;
  userReaction?: string;
}

interface StoryResponse {
  story_chunk: string;
  image_url?: string;
  choices: [string, string];
  is_complete: boolean;
}
```

### Font Configuration
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import { Special_Elite } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const specialElite = Special_Elite({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-special-elite'
});
```

## Error Handling

### Image Loading Errors
- **Fallback Strategy**: Display skeleton loader indefinitely if image fails
- **Retry Logic**: Attempt image reload after 3 seconds
- **Accessibility**: Provide meaningful alt text for screen readers

### API Communication Errors
- **Network Failures**: Display atmospheric error messages ("The spirits are silent...")
- **Timeout Handling**: 30-second timeout with retry option
- **Graceful Degradation**: Allow story continuation without images if necessary

### Form Validation
- **Fear Input**: Minimum 10 characters, maximum 500 characters
- **Genre Selection**: Required field with clear error messaging
- **Real-time Validation**: Immediate feedback without form submission

## Testing Strategy

### Component Testing
- **Setup Screen**: Form validation, submission handling, loading states
- **Narrative Screen**: Text animation, image loading, choice selection
- **Typewriter Effect**: Animation timing, completion callbacks
- **Responsive Layout**: Breakpoint behavior, mobile interactions

### Integration Testing
- **State Transitions**: Setup → Narrative → Loading cycles
- **API Integration**: Request/response handling, error scenarios
- **User Flows**: Complete story progression from setup to conclusion

### Accessibility Testing
- **Keyboard Navigation**: Tab order, focus management
- **Screen Reader Compatibility**: ARIA labels, semantic HTML
- **Color Contrast**: WCAG AA compliance for all text
- **Animation Preferences**: Respect prefers-reduced-motion

## Visual Design System

### Color Palette (CSS Variables)
```css
:root {
  --background: hsl(0 0% 2%);           /* #050505 */
  --foreground: hsl(0 0% 80%);          /* #cccccc */
  --card: hsl(0 0% 4%);                 /* #0a0a0a */
  --card-foreground: hsl(0 0% 80%);     /* #cccccc */
  --primary: hsl(0 75% 35%);            /* #b02828 */
  --primary-foreground: hsl(0 0% 95%);  /* #f2f2f2 */
  --muted-foreground: hsl(0 0% 45%);    /* #737373 */
  --border: hsl(0 0% 15%);              /* #262626 */
}
```

### Typography Scale
- **H1 (Title)**: Special Elite, 2.5rem, letter-spacing: 0.05em
- **H2 (Subtitles)**: Special Elite, 1.5rem
- **Body Text**: Inter, 1rem, line-height: 1.6
- **UI Elements**: Inter, 0.875rem
- **Placeholders**: Inter, 0.875rem, muted-foreground color

### Animation Specifications
- **Typewriter Speed**: 50ms per character (adjustable)
- **Fade Transitions**: 300ms ease-in-out
- **Button Hover**: 150ms ease-out
- **Image Load**: 500ms fade-in
- **Layout Transitions**: 200ms ease-in-out

### Responsive Breakpoints
- **Mobile**: < 768px (single column, full width cards)
- **Tablet**: 768px - 1024px (adjusted spacing, maintained two-column)
- **Desktop**: > 1024px (full two-column layout, optimal spacing)

## Performance Considerations

### Image Optimization
- **Next.js Image Component**: Automatic optimization and lazy loading
- **Aspect Ratio Containers**: Prevent layout shift during loading
- **Skeleton Placeholders**: Immediate visual feedback

### Font Loading
- **next/font**: Automatic font optimization and preloading
- **Font Display**: swap for immediate text rendering
- **Variable Fonts**: Reduced file size where possible

### Bundle Optimization
- **Code Splitting**: Automatic with Next.js App Router
- **Tree Shaking**: Remove unused shadcn/ui components
- **Dynamic Imports**: Load animation libraries only when needed

### Animation Performance
- **CSS Transforms**: Use transform and opacity for smooth animations
- **RequestAnimationFrame**: For custom typewriter implementation
- **Reduced Motion**: Respect user preferences for accessibility