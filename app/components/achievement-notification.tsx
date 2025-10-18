"use client";

import { useEffect, useState } from "react";
import { Achievement } from "@/app/lib/types";
import { Card, CardContent } from "@/app/components/ui/card";

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementNotification({
  achievement,
  onClose,
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 100);

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className="border-primary bg-card shadow-lg shadow-primary/20 min-w-[300px]">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-4xl">{achievement.icon}</div>
            <div className="flex-1">
              <div className="text-xs text-primary font-semibold mb-1">
                🎉 ACHIEVEMENT UNLOCKED!
              </div>
              <h3 className="font-bold text-foreground">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground">
                {achievement.description}
              </p>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
