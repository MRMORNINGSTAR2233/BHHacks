"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Skeleton } from "@/app/components/ui/skeleton";
import { AspectRatio } from "@/app/components/ui/aspect-ratio";
import { Loader2, Volume2, VolumeX } from "lucide-react";
import { TypewriterText } from "@/app/components/typewriter-text";
import { NarrativeScreenProps } from "@/app/lib/types";
import Image from "next/image";

export function NarrativeScreen({
  storyChunk,
  imageUrl,
  videoId,
  choices,
  onChoiceSelect,
  isLoading,
  selectedChoice,
}: NarrativeScreenProps) {
  const [reaction, setReaction] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] =
    useState<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  // Narrate story function
  const narrateStory = useCallback(
    (text: string) => {
      if (!speechSynthesis) return;

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Configure voice for horror atmosphere
      utterance.rate = 0.85; // Slightly slower for dramatic effect
      utterance.pitch = 0.8; // Lower pitch for ominous tone
      utterance.volume = 1.0;

      // Try to use a deeper voice if available
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) =>
          voice.name.includes("Daniel") ||
          voice.name.includes("Male") ||
          voice.name.includes("Deep")
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsNarrating(true);
      utterance.onend = () => setIsNarrating(false);
      utterance.onerror = () => setIsNarrating(false);

      speechSynthesis.speak(utterance);
    },
    [speechSynthesis]
  );

  // Auto-narrate story when it changes
  useEffect(() => {
    if (storyChunk && speechSynthesis && !isLoading) {
      // Small delay to ensure speech synthesis is ready
      const timer = setTimeout(() => {
        narrateStory(storyChunk);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [storyChunk, speechSynthesis, isLoading, narrateStory]);

  const toggleNarration = () => {
    if (!speechSynthesis) return;

    if (isNarrating) {
      speechSynthesis.cancel();
      setIsNarrating(false);
    } else {
      narrateStory(storyChunk);
    }
  };

  const handleChoiceClick = (choice: string) => {
    // Stop narration when making a choice
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsNarrating(false);
    }
    onChoiceSelect(choice, reaction.trim() || undefined);
    setReaction(""); // Clear reaction after selection
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
        {/* Two-column layout for desktop, single column for mobile */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[80vh]"
          role="main"
          aria-label="Interactive horror story"
        >
          {/* Left Column - Story Content */}
          <div className="flex flex-col space-y-6">
            <Card
              className="flex-1 border-border"
              role="article"
              aria-label="Story content"
            >
              <CardContent className="p-6">
                {/* Voice Control Button */}
                {storyChunk && speechSynthesis && (
                  <div className="flex justify-end mb-4">
                    <Button
                      onClick={toggleNarration}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      aria-label={
                        isNarrating ? "Stop narration" : "Play narration"
                      }
                    >
                      {isNarrating ? (
                        <>
                          <VolumeX className="h-4 w-4" />
                          Stop Voice
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4" />
                          Play Voice
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <div
                  className="prose prose-invert max-w-none"
                  role="region"
                  aria-live="polite"
                  aria-label="Current story segment"
                >
                  {storyChunk ? (
                    <TypewriterText text={storyChunk} speed={50} />
                  ) : (
                    <div className="text-muted-foreground italic">
                      The spirits gather their whispers...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Choice Buttons */}
            {choices && choices.length === 2 && (
              <Card
                className="border-border"
                role="region"
                aria-label="Story choices"
              >
                <CardContent className="p-6 space-y-4">
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    role="group"
                    aria-label="Choose your path"
                  >
                    {choices.map((choice, index) => (
                      <Button
                        key={index}
                        onClick={() => handleChoiceClick(choice)}
                        disabled={isLoading}
                        variant={
                          selectedChoice === choice ? "default" : "outline"
                        }
                        className={`p-4 h-auto text-left whitespace-normal transition-all duration-200 ${
                          selectedChoice === choice
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                            : "hover:bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                        }`}
                        aria-label={`Choice ${index + 1}: ${choice}`}
                        aria-pressed={selectedChoice === choice}
                      >
                        {isLoading && selectedChoice === choice ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-sm">
                              The ether whispers back...
                            </span>
                          </div>
                        ) : (
                          <span className="block">{choice}</span>
                        )}
                      </Button>
                    ))}
                  </div>

                  {/* Optional Reaction Input */}
                  <div className="pt-4 border-t border-border">
                    <Label
                      htmlFor="reaction"
                      className="text-sm text-muted-foreground mb-2 block"
                    >
                      Your reaction...
                    </Label>
                    <Textarea
                      id="reaction"
                      placeholder="Share your thoughts on this moment..."
                      value={reaction}
                      onChange={(e) => setReaction(e.target.value)}
                      className="min-h-20 resize-none bg-card/50 border-border/50 text-sm"
                      disabled={isLoading}
                      maxLength={200}
                    />
                    <div className="text-xs text-muted-foreground mt-1 text-right">
                      {reaction.length}/200
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading State Message */}
            {isLoading && (
              <Card className="border-border border-primary/20 pulse-glow">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 text-primary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium animate-pulse">
                      {selectedChoice
                        ? "Shaping your nightmare..."
                        : "The veil thins..."}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    The spirits whisper in the darkness...
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Video/Image */}
          <div className="flex flex-col">
            <Card
              className="flex-1 border-border"
              role="img"
              aria-label="Story illustration"
            >
              <CardContent className="p-6 h-full flex items-center justify-center">
                {videoId ? (
                  /* Video Display */
                  <div className="w-full">
                    <AspectRatio ratio={4 / 3} className="w-full">
                      <video
                        src={videoId}
                        controls
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover rounded-md"
                        aria-label="Animated horror scene"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </AspectRatio>
                    <div className="text-xs text-muted-foreground text-center mt-2 italic">
                      🎬 Animated with Stable Video Diffusion
                    </div>
                  </div>
                ) : (
                  /* Image Display */
                  <AspectRatio ratio={4 / 3} className="w-full">
                    {imageUrl && !imageError ? (
                      <div className="relative w-full h-full">
                        {!imageLoaded && (
                          <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
                        )}
                        <Image
                          src={imageUrl}
                          alt="A haunting scene from your personalized horror story"
                          fill
                          className={`object-cover rounded-md transition-all duration-700 ease-in-out ${
                            imageLoaded
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-95"
                          }`}
                          onLoad={() => setImageLoaded(true)}
                          onError={() => {
                            setImageError(true);
                            setImageLoaded(false);
                          }}
                          priority
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                          quality={85}
                          unoptimized={true}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="w-full h-full rounded-md" />
                      </div>
                    )}
                  </AspectRatio>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
