"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Loader2, Volume2, VolumeX, BookOpen } from "lucide-react";
import { TypewriterText } from "@/app/components/typewriter-text";
import Image from "next/image";

interface StoryModeScreenProps {
  storyChunk: string;
  imageUrl?: string;
  choices: [string, string];
  onChoiceSelect: (choice: string, reaction?: string) => void;
  isLoading: boolean;
  selectedChoice?: string;
}

export function StoryModeScreen({
  storyChunk,
  imageUrl,
  choices,
  onChoiceSelect,
  isLoading,
  selectedChoice,
}: StoryModeScreenProps) {
  const [reaction, setReaction] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] =
    useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const narrateStory = useCallback(
    (text: string) => {
      if (!speechSynthesis) return;
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 0.8;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsNarrating(true);
      utterance.onend = () => setIsNarrating(false);
      utterance.onerror = () => setIsNarrating(false);

      speechSynthesis.speak(utterance);
    },
    [speechSynthesis]
  );

  useEffect(() => {
    if (storyChunk && speechSynthesis && !isLoading) {
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
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsNarrating(false);
    }
    onChoiceSelect(choice, reaction.trim() || undefined);
    setReaction("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-100 dark:from-stone-900 dark:to-black p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Book-like Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-amber-900 dark:text-amber-100 mb-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-2xl font-serif">The Hauntographer</h1>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-amber-900/20 dark:via-amber-100/20 to-transparent" />
        </div>

        {/* Main Content - Book Page Style */}
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-2xl p-8 md:p-12 border-4 border-amber-900/20 dark:border-amber-100/10">
          {/* Voice Control */}
          {storyChunk && speechSynthesis && (
            <div className="flex justify-end mb-6">
              <Button
                onClick={toggleNarration}
                variant="ghost"
                size="sm"
                className="gap-2 text-amber-900 dark:text-amber-100"
              >
                {isNarrating ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    Silence
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    Narrate
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Story Text */}
          <div className="prose prose-lg prose-stone dark:prose-invert max-w-none mb-8 font-serif leading-relaxed">
            {storyChunk ? (
              <TypewriterText text={storyChunk} speed={50} />
            ) : (
              <div className="text-muted-foreground italic text-center">
                The pages turn...
              </div>
            )}
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="my-8 relative aspect-video rounded-lg overflow-hidden shadow-xl border-2 border-amber-900/20 dark:border-amber-100/10">
              <Image
                src={imageUrl}
                alt="Story illustration"
                fill
                className={`object-cover transition-opacity duration-700 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                quality={90}
                unoptimized={true}
              />
            </div>
          )}

          {/* Choices */}
          {choices && choices.length === 2 && (
            <div className="space-y-6 mt-8">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-900/20 dark:via-amber-100/20 to-transparent" />
              
              <div className="text-center text-sm font-serif text-amber-900 dark:text-amber-100 mb-4">
                Choose your path...
              </div>

              <div className="space-y-3">
                {choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoiceClick(choice)}
                    disabled={isLoading}
                    variant="outline"
                    className={`w-full p-6 h-auto text-left whitespace-normal font-serif text-base border-2 ${
                      selectedChoice === choice
                        ? "bg-amber-100 dark:bg-amber-900/30 border-amber-900 dark:border-amber-100"
                        : "border-amber-900/20 dark:border-amber-100/10 hover:bg-amber-50 dark:hover:bg-stone-700"
                    }`}
                  >
                    {isLoading && selectedChoice === choice ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>The story unfolds...</span>
                      </div>
                    ) : (
                      <span className="block">{choice}</span>
                    )}
                  </Button>
                ))}
              </div>

              {/* Optional Reaction */}
              <div className="pt-4">
                <Label
                  htmlFor="reaction"
                  className="text-sm font-serif text-amber-900 dark:text-amber-100 mb-2 block"
                >
                  Your thoughts...
                </Label>
                <Textarea
                  id="reaction"
                  placeholder="Reflect on this moment..."
                  value={reaction}
                  onChange={(e) => setReaction(e.target.value)}
                  className="min-h-20 resize-none font-serif bg-amber-50/50 dark:bg-stone-900/50 border-amber-900/20 dark:border-amber-100/10"
                  disabled={isLoading}
                  maxLength={200}
                />
                <div className="text-xs text-muted-foreground mt-1 text-right font-serif">
                  {reaction.length}/200
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-6">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-amber-900 dark:text-amber-100 mb-2" />
              <div className="text-sm font-serif text-amber-900 dark:text-amber-100">
                The narrative weaves...
              </div>
            </div>
          )}
        </div>

        {/* Book Footer */}
        <div className="text-center mt-6 text-xs font-serif text-amber-900/60 dark:text-amber-100/60">
          ~ A Tale of Terror ~
        </div>
      </div>
    </div>
  );
}
