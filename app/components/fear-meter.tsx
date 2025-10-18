"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";

interface FearMeterProps {
  fearLevel: number; // 0-100
  storyDepth: number; // Number of choices made
}

export function FearMeter({ fearLevel, storyDepth }: FearMeterProps) {
  const [displayLevel, setDisplayLevel] = useState(0);

  useEffect(() => {
    // Animate the fear level change
    const timer = setTimeout(() => {
      setDisplayLevel(fearLevel);
    }, 300);
    return () => clearTimeout(timer);
  }, [fearLevel]);

  const getFearLabel = (level: number) => {
    if (level < 20) return "Uneasy";
    if (level < 40) return "Nervous";
    if (level < 60) return "Frightened";
    if (level < 80) return "Terrified";
    return "Petrified";
  };

  const getFearColor = (level: number) => {
    if (level < 20) return "from-green-500 to-yellow-500";
    if (level < 40) return "from-yellow-500 to-orange-500";
    if (level < 60) return "from-orange-500 to-red-500";
    if (level < 80) return "from-red-500 to-red-700";
    return "from-red-700 to-red-900";
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-pulse">💀</span>
              <span className="text-sm font-medium text-muted-foreground">
                Fear Level
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Depth: {storyDepth}
            </span>
          </div>

          {/* Fear Bar */}
          <div className="relative">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getFearColor(displayLevel)} transition-all duration-1000 ease-out relative`}
                style={{ width: `${displayLevel}%` }}
              >
                {/* Pulsing effect */}
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            
            {/* Percentage Label */}
            <div className="absolute -top-6 right-0 text-xs font-bold text-primary">
              {Math.round(displayLevel)}%
            </div>
          </div>

          {/* Fear Label */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Status:</span>
            <span className={`font-semibold ${
              displayLevel > 60 ? 'text-red-500 animate-pulse' : 'text-foreground'
            }`}>
              {getFearLabel(displayLevel)}
            </span>
          </div>

          {/* Warning Message */}
          {displayLevel > 80 && (
            <div className="text-xs text-red-500 text-center animate-pulse">
              ⚠️ Your sanity is slipping...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
