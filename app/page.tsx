"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  AppState,
  AppData,
  HorrorGenre,
  StorySegment,
  StoryResponse,
  GameMode,
  Achievement,
  GameStatistics,
} from "@/app/lib/types";
import { saveGame, loadGame, hasSavedGame } from "@/lib/utils/save-load";
import { calculateFearLevel } from "@/lib/utils/fear-calculator";
import { checkAchievements } from "@/lib/utils/achievements";
import { AchievementNotification } from "@/app/components/achievement-notification";

// Lazy load components
const ModeSelectionScreen = dynamic(
  () =>
    import("@/app/components/mode-selection-screen").then((mod) => ({
      default: mod.ModeSelectionScreen,
    })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    ),
  }
);

const SetupScreen = dynamic(
  () =>
    import("@/app/components/setup-screen").then((mod) => ({
      default: mod.SetupScreen,
    })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    ),
  }
);

const NarrativeScreen = dynamic(
  () =>
    import("@/app/components/narrative-screen").then((mod) => ({
      default: mod.NarrativeScreen,
    })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading story...</div>
      </div>
    ),
  }
);

// API call
const callGenerateAPI = async (
  storyProfile: { fears: string; genre: HorrorGenre } | undefined,
  storyHistory: Array<{ role: "user" | "model"; content: string }>,
  userReaction?: string
): Promise<StoryResponse> => {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      storyProfile,
      storyHistory,
      userReaction: userReaction || null,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to generate story";
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  return {
    story_chunk: data.nextStoryChunk,
    image_url: data.imageUrl,
    choices: data.choices as [string, string],
    is_complete: false,
  };
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>("modeSelection");
  const [appData, setAppData] = useState<AppData>({
    mode: "story",
    fears: "",
    genre: "Gothic",
    currentStory: "",
    currentImage: undefined,
    currentChoices: ["", ""],
    storyHistory: [],
    fearLevel: 0,
    achievements: [],
    statistics: {
      choicesMade: 0,
      fearLevel: 0,
      timePlayed: 0,
      achievementsUnlocked: 0,
      storiesCompleted: 0,
    },
    startTime: Date.now(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | undefined>();
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(
    null
  );

  // Check for saved game on mount
  useEffect(() => {
    if (typeof window !== "undefined" && hasSavedGame()) {
      // User has a saved game, mode selection will show continue button
    }
  }, []);

  // Update time played
  useEffect(() => {
    if (appState === "narrative" && appData.mode === "game") {
      const interval = setInterval(() => {
        setAppData((prev) => ({
          ...prev,
          statistics: prev.statistics
            ? {
                ...prev.statistics,
                timePlayed: Math.floor(
                  (Date.now() - (prev.startTime || Date.now())) / 1000
                ),
              }
            : prev.statistics,
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [appState, appData.mode, appData.startTime]);

  const handleModeSelect = useCallback((mode: GameMode) => {
    setAppData((prev) => ({
      ...prev,
      mode,
      fearLevel: mode === "game" ? 0 : undefined,
      achievements: mode === "game" ? [] : undefined,
      statistics:
        mode === "game"
          ? {
              choicesMade: 0,
              fearLevel: 0,
              timePlayed: 0,
              achievementsUnlocked: 0,
              storiesCompleted: 0,
            }
          : undefined,
      startTime: mode === "game" ? Date.now() : undefined,
    }));
    setAppState("setup");
  }, []);

  const handleContinue = useCallback(() => {
    const savedData = loadGame();
    if (savedData) {
      setAppData(savedData);
      setAppState("narrative");
    }
  }, []);

  const handleBackToModeSelection = useCallback(() => {
    setAppState("modeSelection");
  }, []);

  const handleSetupSubmit = useCallback(
    async (fears: string, genre: HorrorGenre) => {
      setIsLoading(true);
      setAppState("loading");

      try {
        const response = await callGenerateAPI({ fears, genre }, [], undefined);

        setAppData((prev) => ({
          ...prev,
          fears,
          genre,
          currentStory: response.story_chunk,
          currentImage: response.image_url,
          currentChoices: response.choices,
          storyHistory: [],
        }));

        setAppState("narrative");
      } catch (error) {
        console.error("Failed to generate story:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to generate story. Please try again."
        );
        setAppState("setup");
      } finally {
        setIsLoading(false);
        setSelectedChoice(undefined);
      }
    },
    []
  );

  const handleChoiceSelect = useCallback(
    async (choice: string, reaction?: string) => {
      setIsLoading(true);
      setSelectedChoice(choice);

      const currentSegment: StorySegment = {
        text: appData.currentStory,
        imageUrl: appData.currentImage,
        choices: appData.currentChoices,
        userChoice: choice,
        userReaction: reaction,
      };

      try {
        const apiHistory: Array<{ role: "user" | "model"; content: string }> =
          [];

        appData.storyHistory.forEach((segment) => {
          apiHistory.push({ role: "model", content: segment.text });
          if (segment.userChoice) {
            apiHistory.push({ role: "user", content: segment.userChoice });
          }
        });

        apiHistory.push({ role: "model", content: appData.currentStory });
        apiHistory.push({ role: "user", content: choice });

        const response = await callGenerateAPI(undefined, apiHistory, reaction);

        // Update app data
        const newStoryHistory = [...appData.storyHistory, currentSegment];
        const newChoicesMade = (appData.statistics?.choicesMade || 0) + 1;

        // Calculate new fear level (Game Mode only)
        let newFearLevel = appData.fearLevel || 0;
        if (appData.mode === "game") {
          newFearLevel = calculateFearLevel(
            newFearLevel,
            response.story_chunk,
            newChoicesMade
          );
        }

        // Update statistics
        const newStatistics: GameStatistics = appData.statistics
          ? {
              ...appData.statistics,
              choicesMade: newChoicesMade,
              fearLevel: newFearLevel,
            }
          : {
              choicesMade: newChoicesMade,
              fearLevel: newFearLevel,
              timePlayed: 0,
              achievementsUnlocked: 0,
              storiesCompleted: 0,
            };

        // Check for new achievements (Game Mode only)
        let newAchievements: Achievement[] = [];
        if (appData.mode === "game" && appData.achievements) {
          newAchievements = checkAchievements(
            newStatistics,
            appData.achievements
          );

          if (newAchievements.length > 0) {
            // Show first achievement notification
            setNewAchievement(newAchievements[0]);
            newStatistics.achievementsUnlocked =
              appData.achievements.length + newAchievements.length;
          }
        }

        setAppData((prev) => ({
          ...prev,
          currentStory: response.story_chunk,
          currentImage: response.image_url,
          currentChoices: response.choices,
          storyHistory: newStoryHistory,
          fearLevel: newFearLevel,
          statistics: newStatistics,
          achievements: prev.achievements
            ? [...prev.achievements, ...newAchievements]
            : undefined,
        }));
      } catch (error) {
        console.error("Failed to continue story:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to continue story. Please try again."
        );
      } finally {
        setIsLoading(false);
        setSelectedChoice(undefined);
      }
    },
    [appData]
  );

  const handleSave = useCallback(() => {
    const success = saveGame(appData);
    if (success) {
      alert("Progress saved successfully!");
    } else {
      alert("Failed to save progress. Please try again.");
    }
  }, [appData]);

  const renderCurrentState = useMemo(() => {
    switch (appState) {
      case "modeSelection":
        return (
          <ModeSelectionScreen
            onModeSelect={handleModeSelect}
            hasSavedGame={hasSavedGame()}
            onContinue={handleContinue}
          />
        );

      case "setup":
        return (
          <SetupScreen
            onSubmit={handleSetupSubmit}
            isLoading={isLoading}
            onBack={handleBackToModeSelection}
          />
        );

      case "narrative":
      case "loading":
        return (
          <NarrativeScreen
            mode={appData.mode}
            storyChunk={appData.currentStory}
            imageUrl={appData.currentImage}
            choices={appData.currentChoices}
            onChoiceSelect={handleChoiceSelect}
            isLoading={isLoading}
            selectedChoice={selectedChoice}
            fearLevel={appData.fearLevel}
            storyHistory={appData.storyHistory}
            onSave={appData.mode === "game" ? handleSave : undefined}
          />
        );

      default:
        return (
          <ModeSelectionScreen
            onModeSelect={handleModeSelect}
            hasSavedGame={hasSavedGame()}
            onContinue={handleContinue}
          />
        );
    }
  }, [
    appState,
    isLoading,
    appData,
    selectedChoice,
    handleModeSelect,
    handleContinue,
    handleBackToModeSelection,
    handleSetupSubmit,
    handleChoiceSelect,
    handleSave,
  ]);

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

      {/* Achievement Notification */}
      {newAchievement && (
        <AchievementNotification
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}
    </>
  );
}
