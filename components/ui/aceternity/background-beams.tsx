"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beams = [
    {
      initialX: 10,
      translateX: 10,
      duration: 7,
      repeatDelay: 3,
      delay: 2,
    },
    {
      initialX: 600,
      translateX: 600,
      duration: 3,
      repeatDelay: 3,
      delay: 4,
    },
    {
      initialX: 100,
      translateX: 100,
      duration: 7,
      repeatDelay: 7,
      className: "h-6",
    },
    {
      initialX: 400,
      translateX: 400,
      duration: 5,
      repeatDelay: 14,
      delay: 4,
    },
    {
      initialX: 800,
      translateX: 800,
      duration: 11,
      repeatDelay: 2,
      className: "h-20",
    },
    {
      initialX: 1000,
      translateX: 1000,
      duration: 4,
      repeatDelay: 2,
      className: "h-12",
    },
    {
      initialX: 1200,
      translateX: 1200,
      duration: 6,
      repeatDelay: 4,
      delay: 2,
      className: "h-6",
    },
  ];

  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full overflow-hidden",
        className
      )}
    >
      {beams.map((beam, idx) => (
        <div
          key={`beam-${idx}`}
          style={{
            transform: `translateX(${beam.initialX}px)`,
          }}
          className={cn(
            "absolute left-0 top-20 h-[200vh] w-px bg-gradient-to-t from-purple-500 via-pink-500 to-transparent",
            beam.className
          )}
        >
          <div
            style={{
              animationDuration: `${beam.duration}s`,
              animationDelay: `${beam.delay}s`,
            }}
            className={cn(
              "absolute inset-x-0 top-0 h-64 w-px bg-gradient-to-t from-purple-500 via-pink-500 to-transparent opacity-0",
              "animate-meteor"
            )}
          />
        </div>
      ))}
    </div>
  );
};
