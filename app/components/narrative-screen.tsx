"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Loader2, Volume2, VolumeX, Save } from "lucide-react";
import { TypewriterText } from "@/app/components/typewriter-text";
import { NarrativeScreenProps } from "@/app/lib/types";
import { EnhancedImage } from "@/app/components/enhanced-image";
import { FearMeter } from "@/app/components/fear-meter";
import { StoryTimeline } from "@/app/components/story-timeline";
import Image from "next/image";

export function NarrativeScreen({
  mode,
  storyChunk,
  imageUrl,
  choices,
  onChoiceSelect,
  isLoading,
  selectedChoice,
  fearLevel = 0,
  storyHistory = [],
  onSave,
}: NarrativeScreenProps) {
  const [reaction, setReaction] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] =
    useState<SpeechSynthesis | null>(null);

  const isGameMode = mode === 'game';

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

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 0.8;
      utterance.volume = 1.0;

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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
        {/* Game Mode: Three-column layout */}
        {isGameMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[80vh]">
            {/* Left Sidebar - Game Features */}
            <div className="lg:col-span-3 space-y-4">
              <FearMeter fearLevel={fearLevel} storyDepth={storyHistory.length} />
              <StoryTimeline
                entries={storyHistory.map(seg => ({
                  text: seg.text,
                  choice: seg.userChoice,
                  imageUrl: seg.imageUrl,
                }))}
              />
              {onSave && (
                <Button
                  onClick={onSave}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Progress
                </Button>
              )}
            </div>

            {/* Center - Story Content */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              <Card className="flex-1 border-border">
                <CardContent className="p-6">
                  {storyChunk && speechSynthesis && (
                    <div className="flex justify-end mb-4">
                      <Button
                        onClick={toggleNarration}
                        variant="outline"
                        size="sm"
                        className="gap-2"
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

                  <div className="prose prose-invert max-w-none">
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

              {choices && choices.length === 2 && (
                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {choices.map((choice, index) => (
                        <Button
                          key={index}
                          onClick={() => handleChoiceClick(choice)}
                          disabled={isLoading}
                          variant={selectedChoice === choice ? "default" : "outline"}
                          className={`p-4 h-auto text-left whitespace-normal transition-all duration-200 ${
                            selectedChoice === choice
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                              : "hover:bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                          }`}
                        >
                          {isLoading && selectedChoice === choice ? (
                            <div className="flex items-center justify-center">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span className="text-sm">The ether whispers back...</span>
                            </div>
                          ) : (
                            <span className="block">{choice}</span>
                          )}
                        </Button>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <Label htmlFor="reaction" className="text-sm text-muted-foreground mb-2 block">
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

              {isLoading && (
                <Card className="border-border border-primary/20 pulse-glow">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-primary">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium animate-pulse">
                        {selectedChoice ? "Shaping your nightmare..." : "The veil thins..."}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      The spirits whisper in the darkness...
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right - Enhanced Image */}
            <div className="lg:col-span-3">
              <Card className="border-border h-full">
                <CardContent className="p-4 h-full flex items-center justify-center">
                  {imageUrl && !imageError ? (
                    <EnhancedImage
                      imageUrl={imageUrl}
                      alt="A haunting scene from your personalized horror story"
                    />
                  ) : (
                    <Skeleton className="w-full h-full rounded-md" />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Story Mode: Two-column layout (original) */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[80vh]">
            {/* Left Column - Story Content */}
            <div className="flex flex-col space-y-6">
              <Card className="flex-1 border-border">
                <CardContent className="p-6">
                  {storyChunk && speechSynthesis && (
                    <div className="flex justify-end mb-4">
                      <Button
                        onClick={toggleNarration}
                        variant="outline"
                        size="sm"
                        className="gap-2"
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

                  <div className="prose prose-invert max-w-none">
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

              {choices && choices.length === 2 && (
                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {choices.map((choice, index) => (
                        <Button
                          key={index}
                          onClick={() => handleChoiceClick(choice)}
                          disabled={isLoading}
                          variant={selectedChoice === choice ? "default" : "outline"}
                          className={`p-4 h-auto text-left whitespace-normal transition-all duration-200 ${
                            selectedChoice === choice
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                              : "hover:bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                          }`}
                        >
                          {isLoading && selectedChoice === choice ? (
                            <div className="flex items-center justify-center">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span className="text-sm">The ether whispers back...</span>
                            </div>
                          ) : (
                            <span className="block">{choice}</span>
                          )}
                        </Button>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <Label htmlFor="reaction" className="text-sm text-muted-foreground mb-2 block">
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

              {isLoading && (
                <Card className="border-border border-primary/20 pulse-glow">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-primary">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium animate-pulse">
                        {selectedChoice ? "Shaping your nightmare..." : "The veil thins..."}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      The spirits whisper in the darkness...
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Simple Image */}
            <div className="flex flex-col">
              <Card className="flex-1 border-border">
                <CardContent className="p-6 h-full flex items-center justify-center">
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
                          imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
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
                    <Skeleton className="w-full h-full rounded-md" />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
