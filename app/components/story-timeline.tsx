"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";

interface TimelineEntry {
  text: string;
  choice?: string;
  imageUrl?: string;
}

interface StoryTimelineProps {
  entries: TimelineEntry[];
}

export function StoryTimeline({ entries }: StoryTimelineProps) {
  if (entries.length === 0) return null;

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📖</span>
          <h3 className="text-sm font-medium text-muted-foreground">
            Your Journey
          </h3>
        </div>

        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div key={index} className="relative pl-6 pb-3">
                {/* Timeline Line */}
                {index < entries.length - 1 && (
                  <div className="absolute left-2 top-6 bottom-0 w-px bg-border" />
                )}

                {/* Timeline Dot */}
                <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${
                  index === entries.length - 1
                    ? 'bg-primary border-primary animate-pulse'
                    : 'bg-muted border-border'
                }`} />

                {/* Content */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {entry.text.substring(0, 80)}...
                  </p>
                  {entry.choice && (
                    <p className="text-xs text-primary font-medium">
                      → {entry.choice}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
