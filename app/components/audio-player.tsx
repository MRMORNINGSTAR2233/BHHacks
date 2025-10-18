"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { GameMode } from "@/app/lib/types";

interface AudioPlayerProps {
  mode: GameMode;
  fearLevel?: number;
  isPlaying?: boolean;
}

export function AudioPlayer({ mode, fearLevel = 0, isPlaying = true }: AudioPlayerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current || !isInitialized) return;

    // Change audio based on mode and fear level
    let audioSrc = "";
    
    if (mode === "story") {
      // Subtle ambient horror for story mode
      audioSrc = "https://assets.mixkit.co/active_storage/sfx/2466/2466-preview.mp3"; // Placeholder
    } else {
      // More intense for game mode
      if (fearLevel < 40) {
        audioSrc = "https://assets.mixkit.co/active_storage/sfx/2466/2466-preview.mp3";
      } else if (fearLevel < 70) {
        audioSrc = "https://assets.mixkit.co/active_storage/sfx/2467/2467-preview.mp3";
      } else {
        audioSrc = "https://assets.mixkit.co/active_storage/sfx/2468/2468-preview.mp3";
      }
    }

    if (audioRef.current.src !== audioSrc) {
      audioRef.current.src = audioSrc;
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(() => {
          // Autoplay blocked, user needs to interact first
        });
      }
    }
  }, [mode, fearLevel, isInitialized, isPlaying, isMuted]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isMuted || !isPlaying) {
      audioRef.current.pause();
    } else if (isInitialized) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked
      });
    }
  }, [isMuted, isPlaying, isInitialized]);

  const handleToggle = () => {
    if (!isInitialized) {
      setIsInitialized(true);
      setIsMuted(false);
    } else {
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleToggle}
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
        title={isMuted ? "Unmute audio" : "Mute audio"}
      >
        {isMuted || !isInitialized ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
