"use client";

import { Card, CardContent } from "@/app/components/ui/card";

interface GameHUDProps {
  health: number; // 0-100
  sanity: number; // 0-100
  fearLevel: number; // 0-100
}

export function GameHUD({ health, sanity, fearLevel }: GameHUDProps) {
  const getBarColor = (value: number, inverse: boolean = false) => {
    if (inverse) {
      // For fear - higher is worse
      if (value < 30) return "bg-green-500";
      if (value < 60) return "bg-yellow-500";
      if (value < 80) return "bg-orange-500";
      return "bg-red-500";
    } else {
      // For health/sanity - lower is worse
      if (value > 70) return "bg-green-500";
      if (value > 40) return "bg-yellow-500";
      if (value > 20) return "bg-orange-500";
      return "bg-red-500";
    }
  };

  return (
    <Card className="border-border bg-black/40 backdrop-blur-sm">
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Health Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-400 font-medium flex items-center gap-1">
                <span>❤️</span> Health
              </span>
              <span className="text-foreground font-mono">{health}%</span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor(health)} transition-all duration-500`}
                style={{ width: `${health}%` }}
              />
            </div>
          </div>

          {/* Sanity Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-400 font-medium flex items-center gap-1">
                <span>🧠</span> Sanity
              </span>
              <span className="text-foreground font-mono">{sanity}%</span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor(sanity)} transition-all duration-500`}
                style={{ width: `${sanity}%` }}
              />
            </div>
          </div>

          {/* Fear Level */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-400 font-medium flex items-center gap-1">
                <span>💀</span> Fear
              </span>
              <span className="text-foreground font-mono">{fearLevel}%</span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor(fearLevel, true)} transition-all duration-500 animate-pulse`}
                style={{ width: `${fearLevel}%` }}
              />
            </div>
          </div>

          {/* Warning */}
          {(health < 30 || sanity < 30) && (
            <div className="text-xs text-red-500 text-center animate-pulse pt-1">
              ⚠️ Critical Status!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
