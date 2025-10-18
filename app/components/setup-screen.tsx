"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import { Loader2 } from "lucide-react";
import { SetupScreenProps, HorrorGenre } from "@/app/lib/types";

const HORROR_GENRES: HorrorGenre[] = ['Gothic', 'Cosmic', 'Slasher', 'Psychological'];

export function SetupScreen({ onSubmit, isLoading, onBack }: SetupScreenProps) {
  const [fears, setFears] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<HorrorGenre | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fears.trim() && selectedGenre) {
      onSubmit(fears.trim(), selectedGenre as HorrorGenre);
    }
  };

  const isFormValid = fears.trim().length >= 10 && fears.trim().length <= 500 && selectedGenre;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl mx-auto border-border animate-in fade-in duration-500" role="main" aria-labelledby="app-title">
        <CardHeader className="text-center space-y-4 relative">
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="absolute left-4 top-4 z-20"
              disabled={isLoading}
            >
              ← Back
            </Button>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50"></div>
          <h1 id="app-title" className="font-title text-title text-foreground relative z-10 drop-shadow-lg">
            The Hauntographer
          </h1>
          <p className="text-muted-foreground text-lg relative z-10" role="doc-subtitle">
            An Oracle of Personalized Fear
          </p>
          <div className="text-xs text-muted-foreground/70 relative z-10 italic">
            &ldquo;Where nightmares take shape and fears find form&rdquo;
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8" role="form" aria-label="Horror story setup form">
            {/* Fear Input Section */}
            <div className="space-y-3">
              <Label htmlFor="fears" className="text-foreground font-medium">
                Confess Your Fears
              </Label>
              <Textarea
                id="fears"
                placeholder="Whisper your fears into the void..."
                value={fears}
                onChange={(e) => setFears(e.target.value)}
                className={`min-h-32 resize-none bg-card border-border text-foreground placeholder:text-muted-foreground transition-colors ${
                  fears.length > 0 && fears.length < 10 
                    ? "border-destructive focus:border-destructive" 
                    : "focus:border-primary"
                }`}
                maxLength={500}
                disabled={isLoading}
                aria-describedby="fears-help"
              />
              <div id="fears-help" className="flex justify-between text-sm">
                <span className={fears.length > 0 && fears.length < 10 ? "text-destructive" : "text-muted-foreground"}>
                  {fears.length < 10 && fears.length > 0 
                    ? `Minimum 10 characters (${10 - fears.length} more needed)` 
                    : fears.length >= 10 
                    ? "✓ Fear confession accepted" 
                    : "Share what haunts you most..."
                  }
                </span>
                <span className="text-muted-foreground">{fears.length}/500</span>
              </div>
            </div>

            {/* Genre Selection Section */}
            <fieldset className="space-y-4">
              <legend className="text-foreground font-medium">
                Select Your Poison
              </legend>
              <RadioGroup
                value={selectedGenre}
                onValueChange={(value) => setSelectedGenre(value as HorrorGenre)}
                disabled={isLoading}
                className="grid grid-cols-2 gap-4"
                aria-describedby="genre-help"
                role="radiogroup"
                aria-required="true"
              >
                {HORROR_GENRES.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2 p-2 rounded-md hover:bg-card/50 transition-colors">
                    <RadioGroupItem
                      value={genre}
                      id={genre}
                      className="border-border text-primary"
                    />
                    <Label
                      htmlFor={genre}
                      className="text-foreground cursor-pointer hover:text-primary transition-colors flex-1"
                    >
                      {genre}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div id="genre-help" className="text-sm text-muted-foreground" aria-live="polite">
                {selectedGenre ? `✓ ${selectedGenre} horror selected` : "Choose the style of terror that calls to you"}
              </div>
            </fieldset>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 transition-all duration-150 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    The ritual begins...
                  </>
                ) : (
                  "Begin the Descent"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}