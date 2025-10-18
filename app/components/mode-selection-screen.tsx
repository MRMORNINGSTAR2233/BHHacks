"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { GameMode } from "@/app/lib/types";

interface ModeSelectionScreenProps {
  onModeSelect: (mode: GameMode) => void;
  hasSavedGame: boolean;
  onContinue?: () => void;
}

export function ModeSelectionScreen({
  onModeSelect,
  hasSavedGame,
  onContinue,
}: ModeSelectionScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full animate-in fade-in duration-700">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
            The Hauntographer
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose Your Experience
          </p>
        </div>

        {/* Continue Button (if save exists) */}
        {hasSavedGame && onContinue && (
          <div className="mb-8">
            <Button
              onClick={onContinue}
              variant="outline"
              className="w-full p-6 text-lg border-primary/50 hover:border-primary hover:bg-primary/10"
            >
              <span className="mr-2">💾</span>
              Continue Your Story
            </Button>
          </div>
        )}

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Story Mode */}
          <Card
            className="border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group"
            onClick={() => onModeSelect('story')}
          >
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  📖
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Story Mode
                </h2>
                <p className="text-muted-foreground">
                  A pure narrative experience. Focus on the story without distractions.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>✓ Immersive storytelling</li>
                  <li>✓ AI-generated images</li>
                  <li>✓ Voice narration</li>
                  <li>✓ Simple, clean interface</li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  Start Story Mode
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Game Mode */}
          <Card
            className="border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
            onClick={() => onModeSelect('game')}
          >
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Enhanced
            </div>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  🎮
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Game Mode
                </h2>
                <p className="text-muted-foreground">
                  An enhanced experience with gamification and visual effects.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>✓ Everything in Story Mode</li>
                  <li>✓ Fear meter & statistics</li>
                  <li>✓ Achievements & progress</li>
                  <li>✓ Enhanced visual effects</li>
                  <li>✓ Story timeline</li>
                  <li>✓ Save/Load system</li>
                </ul>
                <Button
                  className="w-full mt-4 group-hover:scale-105 transition-transform"
                >
                  Start Game Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>You can switch modes anytime by starting a new story</p>
        </div>
      </div>
    </div>
  );
}
