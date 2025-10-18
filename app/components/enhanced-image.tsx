"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AspectRatio } from "@/app/components/ui/aspect-ratio";

interface EnhancedImageProps {
  imageUrl: string;
  alt: string;
}

export function EnhancedImage({ imageUrl, alt }: EnhancedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <AspectRatio ratio={4 / 3} className="w-full overflow-hidden rounded-md">
      <div className="relative w-full h-full group">
        {/* Main Image with Parallax */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
          }}
        >
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className={`object-cover transition-all duration-700 ease-in-out ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
            quality={85}
            unoptimized={true}
          />
        </div>

        {imageLoaded && (
          <>
            {/* Animated Fog Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent animate-fog-1" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent animate-fog-2" />
            </div>

            {/* Vignette Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 pointer-events-none" />

            {/* Subtle Grain/Noise */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none grain-texture" />

            {/* Flickering Light Effect */}
            <div className="absolute inset-0 bg-white/5 animate-flicker pointer-events-none" />

            {/* Breathing Shadow */}
            <div className="absolute inset-0 bg-black/10 animate-pulse-slow pointer-events-none" />

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${8 + Math.random() * 4}s`,
                  }}
                />
              ))}
            </div>

            {/* Corner Shadows (Horror Effect) */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-black/60 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-black/60 to-transparent pointer-events-none" />
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }

        @keyframes flicker {
          0%, 100% { opacity: 0; }
          10% { opacity: 0.1; }
          20% { opacity: 0; }
          30% { opacity: 0.05; }
          40%, 90% { opacity: 0; }
          95% { opacity: 0.08; }
        }

        @keyframes fog-1 {
          0%, 100% { transform: translateX(0) translateY(0); opacity: 0.3; }
          50% { transform: translateX(-10px) translateY(-5px); opacity: 0.5; }
        }

        @keyframes fog-2 {
          0%, 100% { transform: translateX(0) translateY(0); opacity: 0.2; }
          50% { transform: translateX(10px) translateY(5px); opacity: 0.4; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.3; }
          50% { transform: translateY(-100px) translateX(20px); opacity: 0.6; }
          90% { opacity: 0.3; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-flicker {
          animation: flicker 8s ease-in-out infinite;
        }

        .animate-fog-1 {
          animation: fog-1 15s ease-in-out infinite;
        }

        .animate-fog-2 {
          animation: fog-2 20s ease-in-out infinite reverse;
        }

        .animate-float {
          animation: float 10s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(
            circle at center,
            transparent 0%,
            transparent 40%,
            rgba(0, 0, 0, 0.6) 100%
          );
        }

        .grain-texture {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>
    </AspectRatio>
  );
}
