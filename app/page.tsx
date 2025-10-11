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

// Mock API function - replace with actual API calls later
const mockApiCall = async (fears: string, genre: HorrorGenre, previousChoice?: string): Promise<StoryResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const storyVariation = previousChoice 
    ? `Your choice to "${previousChoice.toLowerCase()}" leads you deeper into the ${genre.toLowerCase()} nightmare. The fear of ${fears.toLowerCase()} manifests in ways you never imagined.`
    : `The shadows whisper of your fear of ${fears.toLowerCase()}. In this ${genre.toLowerCase()} tale, you find yourself standing at a crossroads where reality bends and nightmares take form. The air grows cold as something ancient stirs in the darkness ahead.`;
  
  return {
    story_chunk: storyVariation,
    image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    choices: [
      "Step forward into the darkness, embracing whatever awaits",
      "Turn back and seek another path, hoping to avoid your fate"
    ],
    is_complete: false
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
      const response = await mockApiCall(fears, genre);
      
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
      // Handle error - could show error message
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
      const response = await mockApiCall(appData.fears, appData.genre, choice);
      
      setAppData(prev => ({
        ...prev,
        currentStory: response.story_chunk,
        currentImage: response.image_url,
        currentChoices: response.choices,
        storyHistory: [...prev.storyHistory, currentSegment]
      }));
      
    } catch (error) {
      console.error('Failed to continue story:', error);
      // Handle error - could show error message or retry option
    } finally {
      setIsLoading(false);
      setSelectedChoice(undefined);
    }
  }, [appData.fears, appData.genre, appData.currentStory, appData.currentImage, appData.currentChoices]);

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
