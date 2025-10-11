"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { AppState, AppData, HorrorGenre, StorySegment, StoryResponse } from "@/app/lib/types";

// Lazy load components for better performance
const SetupScreen = dynamic(() => import("@/app/components/setup-screen").then(mod => ({ default: mod.SetupScreen })), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-background"><div className="text-foreground">Loading...</div></div>
});

const NarrativeScreen = dynamic(() => import("@/app/components/narrative-screen").then(mod => ({ default: mod.NarrativeScreen })), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-background"><div className="text-foreground">Loading story...</div></div>
});

// Real API call to backend
const callGenerateAPI = async (
  storyProfile: { fears: string; genre: HorrorGenre } | undefined,
  storyHistory: Array<{ role: 'user' | 'model'; content: string }>,
  userReaction?: string
): Promise<StoryResponse> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      storyProfile,
      storyHistory,
      userReaction: userReaction || null,
      flags: {
        generateVideo: false, // Set to true if you want video generation
      },
    }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to generate story';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  // Transform API response to match StoryResponse interface
  return {
    story_chunk: data.nextStoryChunk,
    image_url: data.visuals.imageUrl,
    choices: data.choices as [string, string],
    is_complete: false,
  };
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>('setup');
  const [appData, setAppData] = useState<AppData>({
    fears: '',
    genre: 'Gothic',
    currentStory: '',
    currentImage: undefined,
    currentChoices: ['', ''],
    storyHistory: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | undefined>();

  const handleSetupSubmit = useCallback(async (fears: string, genre: HorrorGenre) => {
    setIsLoading(true);
    setAppState('loading');
    
    try {
      // Call real API with initial story profile
      const response = await callGenerateAPI(
        { fears, genre },
        [], // Empty history for first turn
        undefined
      );
      
      setAppData(prev => ({
        ...prev,
        fears,
        genre,
        currentStory: response.story_chunk,
        currentImage: response.image_url,
        currentChoices: response.choices,
        storyHistory: []
      }));
      
      setAppState('narrative');
    } catch (error) {
      console.error('Failed to generate story:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate story. Please try again.');
      setAppState('setup');
    } finally {
      setIsLoading(false);
      setSelectedChoice(undefined);
    }
  }, []);

  const handleChoiceSelect = useCallback(async (choice: string, reaction?: string) => {
    setIsLoading(true);
    setSelectedChoice(choice);
    
    // Save current segment to history
    const currentSegment: StorySegment = {
      text: appData.currentStory,
      imageUrl: appData.currentImage,
      choices: appData.currentChoices,
      userChoice: choice,
      userReaction: reaction
    };

    try {
      // Build story history in the format the API expects
      const apiHistory: Array<{ role: 'user' | 'model'; content: string }> = [];
      
      // Add all previous segments
      appData.storyHistory.forEach(segment => {
        apiHistory.push({ role: 'model', content: segment.text });
        if (segment.userChoice) {
          apiHistory.push({ role: 'user', content: segment.userChoice });
        }
      });
      
      // Add current segment
      apiHistory.push({ role: 'model', content: appData.currentStory });
      apiHistory.push({ role: 'user', content: choice });
      
      // Call real API with history
      const response = await callGenerateAPI(
        undefined, // No need to send profile again
        apiHistory,
        reaction
      );
      
      setAppData(prev => ({
        ...prev,
        currentStory: response.story_chunk,
        currentImage: response.image_url,
        currentChoices: response.choices,
        storyHistory: [...prev.storyHistory, currentSegment]
      }));
      
    } catch (error) {
      console.error('Failed to continue story:', error);
      alert(error instanceof Error ? error.message : 'Failed to continue story. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedChoice(undefined);
    }
  }, [appData.storyHistory, appData.currentStory, appData.currentImage, appData.currentChoices]);

  const renderCurrentState = useMemo(() => {
    switch (appState) {
      case 'setup':
        return (
          <SetupScreen
            onSubmit={handleSetupSubmit}
            isLoading={isLoading}
          />
        );
      
      case 'narrative':
      case 'loading':
        return (
          <NarrativeScreen
            storyChunk={appData.currentStory}
            imageUrl={appData.currentImage}
            choices={appData.currentChoices}
            onChoiceSelect={handleChoiceSelect}
            isLoading={isLoading}
            selectedChoice={selectedChoice}
          />
        );
      
      default:
        return (
          <SetupScreen
            onSubmit={handleSetupSubmit}
            isLoading={isLoading}
          />
        );
    }
  }, [appState, isLoading, appData, selectedChoice, handleSetupSubmit, handleChoiceSelect]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-background">
        <div className="transition-all duration-500 ease-in-out">
          {renderCurrentState}
        </div>
      </main>
    </>
  );
}
