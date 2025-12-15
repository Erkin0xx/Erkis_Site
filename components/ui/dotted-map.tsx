"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DottedMapProps {
  className?: string;
  highlightedCities?: Array<{
    name: string;
    lat: number;
    lng: number;
    color?: string;
  }>;
}

export const DottedMap = ({ className, highlightedCities = [] }: DottedMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const dotSpacing = 25;
    const dotRadius = 1;

    // Draw base dots
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let x = 0; x < canvas.width; x += dotSpacing) {
      for (let y = 0; y < canvas.height; y += dotSpacing) {
        // Create a "world map" shape by skipping some dots (simplified)
        const shouldSkip = Math.random() > 0.3;
        if (shouldSkip) continue;

        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Highlight cities
    highlightedCities.forEach((city) => {
      // Convert lat/lng to canvas coordinates (simplified projection)
      const x = ((city.lng + 180) / 360) * canvas.width;
      const y = ((90 - city.lat) / 180) * canvas.height;

      // Draw glowing circle
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
      gradient.addColorStop(0, city.color || "rgba(236, 72, 153, 0.8)"); // pink
      gradient.addColorStop(0.5, city.color || "rgba(168, 85, 247, 0.4)"); // purple
      gradient.addColorStop(1, "rgba(168, 85, 247, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();

      // Draw bright center dot
      ctx.fillStyle = city.color || "#ec4899";
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [highlightedCities]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none opacity-40", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 1.5 }}
    />
  );
};
