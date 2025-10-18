"use client";


import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Loader2, Save, Play } from "lucide-react";
import { GameRenderer } from "@/app/components/game-renderer";
import { GameHUD } from "@/app/components/game-hud";
import { GameInventory, InventoryItem } from "@/app/components/game-inventory";

interface GameModeScreenProps {
  gameCode?: string;
  isGenerating: boolean;
  onGenerateGame: () => void;
  onRegenerateGame?: () => void;
  health: number;
  sanity: number;
  fearLevel: number;
  inventory: InventoryItem[];
  onSave?: () => void;
  onUseItem?: (itemId: string) => void;
  onGameStateChange?: (state: unknown) => void;
}

export function GameModeScreen({
  gameCode,
  isGenerating,
  onGenerateGame,
  onRegenerateGame,
  health,
  sanity,
  fearLevel,
  inventory,
  onSave,
  onUseItem,
  onGameStateChange,
}: GameModeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 mb-2">
            🎮 Horror Game Mode
          </h1>
          <p className="text-sm text-muted-foreground">
            Your personalized horror game experience
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Game Stats */}
          <div className="lg:col-span-3 space-y-4">
            <GameHUD health={health} sanity={sanity} fearLevel={fearLevel} />
            <GameInventory items={inventory} onUseItem={onUseItem} />
            {onSave && (
              <Button
                onClick={onSave}
                variant="outline"
                className="w-full bg-primary/10 border-primary/30 hover:bg-primary/20"
                disabled={isGenerating}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Game
              </Button>
            )}
            {onRegenerateGame && gameCode && (
              <Button
                onClick={onRegenerateGame}
                variant="outline"
                className="w-full bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20"
                disabled={isGenerating}
              >
                <Play className="h-4 w-4 mr-2" />
                Generate New Game
              </Button>
            )}
          </div>

          {/* Center - Game Display */}
          <div className="lg:col-span-9">
            {isGenerating ? (
              /* Loading State */
              <Card className="border-border bg-gradient-to-br from-gray-900 to-black">
                <CardContent className="p-12 text-center">
                  <div className="max-w-md mx-auto space-y-6">
                    <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">
                      Generating Your Game...
                    </h2>
                    <p className="text-muted-foreground">
                      The AI is crafting a unique horror game experience just for you.
                      This may take a moment...
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : gameCode ? (
              /* Game Display */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    🎮 Your Horror Game
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    Use WASD or Arrow keys to play
                  </div>
                </div>
                <GameRenderer
                  gameCode={gameCode}
                  onGameStateChange={onGameStateChange}
                />
                <div className="text-xs text-center text-muted-foreground">
                  💡 Tip: Click the fullscreen button for the best experience
                </div>
              </div>
            ) : (
              /* Initial State - No Game Yet */
              <Card className="border-border bg-gradient-to-br from-gray-900 to-black">
                <CardContent className="p-12 text-center">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="text-6xl mb-4">🎮</div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Ready to Play?
                    </h2>
                    <p className="text-muted-foreground">
                      Your personalized horror game is ready to be generated based on your
                      description. Click below to start playing!
                    </p>
                    <Button
                      onClick={onGenerateGame}
                      size="lg"
                      className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Generate & Play Game
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
