"use client";

import { Achievement, GameStatistics } from "@/app/lib/types";
import { Card, CardContent } from "@/app/components/ui/card";
import { getFearLabel } from "@/lib/utils/fear-calculator";

interface StatsPanelProps {
  stats: GameStatistics;
  achievements: Achievement[];
}

export function StatsPanel({ stats, achievements }: StatsPanelProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <span className="text-xl">📊</span>
            <h3 className="text-sm font-medium text-muted-foreground">
              Statistics
            </h3>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Choices Made</div>
              <div className="text-2xl font-bold text-foreground">
                {stats.choicesMade}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Fear Level</div>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(stats.fearLevel)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {getFearLabel(stats.fearLevel)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Time Played</div>
              <div className="text-lg font-bold text-foreground">
                {formatTime(stats.timePlayed)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Achievements</div>
              <div className="text-lg font-bold text-foreground">
                {stats.achievementsUnlocked}
              </div>
            </div>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="border-t border-border pt-3">
              <div className="text-xs text-muted-foreground mb-2">
                Unlocked Achievements
              </div>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-full px-2 py-1"
                    title={achievement.description}
                  >
                    <span className="text-sm">{achievement.icon}</span>
                    <span className="text-xs text-foreground">
                      {achievement.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
