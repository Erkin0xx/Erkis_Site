"use client";

import { cn } from "@/lib/utils";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AuroraText({ children, className }: AuroraTextProps) {
  return (
    <span
      className={cn(
        "relative inline-block",
        "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
        "bg-clip-text text-transparent",
        "animate-aurora",
        className
      )}
      style={{
        backgroundSize: "200% 200%",
        animation: "aurora 3s ease-in-out infinite",
      }}
    >
      <style jsx>{`
        @keyframes aurora {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
      {children}
    </span>
  );
}
