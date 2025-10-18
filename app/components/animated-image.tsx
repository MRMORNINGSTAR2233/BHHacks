"use client";

import { useState } from "react";
import Image from "next/image";
import { AspectRatio } from "@/app/components/ui/aspect-ratio";

interface AnimatedImageProps {
  imageUrl: string;
  alt: string;
}

export function AnimatedImage({ imageUrl, alt }: AnimatedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <AspectRatio ratio={4 / 3} className="w-full overflow-hidden">
      <div className="relative w-full h-full">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className={`object-cover rounded-md transition-all duration-700 ease-in-out ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          onLoad={() => setImageLoaded(true)}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
          quality={85}
          unoptimized={true}
        />
        
        {/* Subtle animated overlay for "living" effect */}
        {imageLoaded && (
          <>
            {/* Breathing shadow effect */}
            <div className="absolute inset-0 bg-black/20 animate-pulse-slow pointer-events-none" />
            
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40 pointer-events-none" />
            
            {/* Flickering light effect */}
            <div className="absolute inset-0 bg-white/5 animate-flicker pointer-events-none" />
          </>
        )}
      </div>
      
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 0; }
          10% { opacity: 0.1; }
          20% { opacity: 0; }
          30% { opacity: 0.05; }
          40% { opacity: 0; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-flicker {
          animation: flicker 8s ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, transparent 0%, transparent 60%, rgba(0,0,0,0.4) 100%);
        }
      `}</style>
    </AspectRatio>
  );
}
