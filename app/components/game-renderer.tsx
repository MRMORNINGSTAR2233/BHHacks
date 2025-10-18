"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Loader2, Maximize2, Minimize2, RotateCcw } from "lucide-react";

interface GameRendererProps {
  gameCode: string;
  onGameStateChange?: (state: unknown) => void;
}

export function GameRenderer({ gameCode, onGameStateChange }: GameRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (iframeRef.current && gameCode) {
      const iframe = iframeRef.current;
      
      console.log('[GameRenderer] Starting render, code length:', gameCode.length);
      console.log('[GameRenderer] Code preview:', gameCode.substring(0, 500));
      
      // Small delay to ensure iframe is ready
      setTimeout(() => {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (doc) {
          // Extract style and script tags from game code
          const styleMatch = gameCode.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
          const scriptMatch = gameCode.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
          
          const gameStyles = styleMatch ? styleMatch[1] : '';
          const gameScript = scriptMatch ? scriptMatch[1] : gameCode; // If no script tags, treat whole thing as script
          
          console.log('[GameRenderer] Extracted styles length:', gameStyles.length);
          console.log('[GameRenderer] Extracted script length:', gameScript.length);
          
          // Create complete HTML document with game code
          const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Horror Game</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Courier New', monospace;
      background: #000;
      color: #fff;
      overflow: auto;
      width: 100vw;
      height: 100vh;
    }
    #game-container {
      width: 100%;
      height: 100%;
      position: relative;
    }
    ${gameStyles}
  </style>
</head>
<body>
  <div id="game-container"></div>
  <script>
    console.log('[Game] Starting game initialization');
    
    try {
      ${gameScript}
      console.log('[Game] Game code executed successfully');
    } catch(e) {
      console.error('[Game] Error executing game code:', e);
      document.getElementById('game-container').innerHTML = '<div style="color: red; padding: 20px; text-align: center;"><h2>Game Error</h2><p>' + e.message + '</p><p>Check console for details</p></div>';
    }
    
    // Send game state updates to parent
    window.sendGameState = function(state) {
      try {
        window.parent.postMessage({ type: 'gameState', state }, '*');
      } catch(e) {
        console.error('Failed to send game state:', e);
      }
    };
    
    // Listen for save/load commands
    window.addEventListener('message', function(e) {
      if (e.data.type === 'saveGame') {
        const state = window.getGameState ? window.getGameState() : {};
        window.parent.postMessage({ type: 'gameSaved', state }, '*');
      } else if (e.data.type === 'loadGame') {
        if (window.setGameState) {
          window.setGameState(e.data.state);
        }
      }
    });
    
    // Error handling
    window.addEventListener('error', function(e) {
      console.error('[Game] Runtime error:', e.message, e.filename, e.lineno);
    });
    
    console.log('[Game] Initialization complete');
  </script>
</body>
</html>
          `;
          
          try {
            doc.open();
            doc.write(fullHTML);
            doc.close();
            console.log('[GameRenderer] Game HTML written to iframe');
            setIsLoading(false);
          } catch (error) {
            console.error('[GameRenderer] Failed to render game:', error);
            setIsLoading(false);
          }
        } else {
          console.error('[GameRenderer] Could not access iframe document');
          setIsLoading(false);
        }
      }, 100);
    }
  }, [gameCode]);

  // Listen for game state updates
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'gameState' && onGameStateChange) {
        onGameStateChange(e.data.state);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onGameStateChange]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      iframeRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resetGame = () => {
    if (iframeRef.current && gameCode) {
      console.log('[GameRenderer] Resetting game...');
      setIsLoading(true);
      
      // Force reload by clearing and re-rendering
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write('');
        doc.close();
        
        // Re-render after a short delay
        setTimeout(() => {
          const newDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (newDoc) {
            // Extract and re-inject the game code
            const styleMatch = gameCode.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
            const scriptMatch = gameCode.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
            
            const gameStyles = styleMatch ? styleMatch[1] : '';
            const gameScript = scriptMatch ? scriptMatch[1] : gameCode;
            
            const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Horror Game</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; background: #000; color: #fff; overflow: auto; width: 100vw; height: 100vh; }
    #game-container { width: 100%; height: 100%; position: relative; }
    ${gameStyles}
  </style>
</head>
<body>
  <div id="game-container"></div>
  <script>
    console.log('[Game] Restarting game...');
    try {
      ${gameScript}
      console.log('[Game] Game restarted successfully');
    } catch(e) {
      console.error('[Game] Error restarting game:', e);
    }
    window.sendGameState = function(state) {
      try { window.parent.postMessage({ type: 'gameState', state }, '*'); } catch(e) {}
    };
    window.addEventListener('message', function(e) {
      if (e.data.type === 'saveGame') {
        const state = window.getGameState ? window.getGameState() : {};
        window.parent.postMessage({ type: 'gameSaved', state }, '*');
      } else if (e.data.type === 'loadGame') {
        if (window.setGameState) window.setGameState(e.data.state);
      }
    });
  </script>
</body>
</html>
            `;
            
            newDoc.open();
            newDoc.write(fullHTML);
            newDoc.close();
            console.log('[GameRenderer] Game reset complete');
            setIsLoading(false);
          }
        }, 100);
      }
    }
  };

  return (
    <Card className="border-border bg-black/40 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0 relative">
        {/* Game Controls */}
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Button
            onClick={resetGame}
            size="sm"
            variant="outline"
            className="bg-black/60 backdrop-blur-sm border-primary/30"
            title="Reset Game"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            onClick={toggleFullscreen}
            size="sm"
            variant="outline"
            className="bg-black/60 backdrop-blur-sm border-primary/30"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <div className="text-sm text-muted-foreground">Loading game...</div>
            </div>
          </div>
        )}
        
        {/* Debug Info */}
        {!isLoading && gameCode && (
          <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-black/60 px-2 py-1 rounded">
            Game loaded ({gameCode.length} chars)
          </div>
        )}

        {/* Game Iframe */}
        <iframe
          ref={iframeRef}
          className="w-full min-h-[600px] h-[70vh] border-0 bg-black"
          title="Horror Game"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </CardContent>
    </Card>
  );
}
