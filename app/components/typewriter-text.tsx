"use client";

import { useEffect, useState } from "react";
import { TypewriterTextProps } from "@/app/lib/types";

export function TypewriterText({ text, speed = 50, onComplete }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (prefersReducedMotion) {
      // If user prefers reduced motion, show all text immediately
      setDisplayedText(text);
      setCurrentIndex(text.length);
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
      return;
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, onComplete, isComplete, prefersReducedMotion]);

  // Handle line breaks properly
  const formatText = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  // If text is empty, don't render anything
  if (!text.trim()) {
    return null;
  }

  return (
    <div className="font-body text-foreground leading-relaxed">
      {formatText(displayedText)}
      {currentIndex < text.length && !prefersReducedMotion && (
        <span className="animate-pulse text-primary ml-1">|</span>
      )}
    </div>
  );
}

// Alternative custom implementation for more control
export function CustomTypewriterText({ text, speed = 50, onComplete }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, onComplete, isComplete]);

  // Handle line breaks properly
  const formatText = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="font-body text-foreground leading-relaxed">
      {formatText(displayedText)}
      {currentIndex < text.length && (
        <span className="animate-pulse text-primary ml-1">|</span>
      )}
    </div>
  );
}