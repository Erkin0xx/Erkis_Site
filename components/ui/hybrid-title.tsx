"use client";

import { EncryptedText } from "./encrypted-text";
import { motion } from "framer-motion";

interface HybridTitleProps {
  text: string;
  className?: string;
}

export const HybridEncryptedAuroraTitle = ({ text, className = "" }: HybridTitleProps) => {
  return (
    <div className="relative">
      {/* Aurora glow background effect */}
      <motion.div
        className="absolute -inset-x-20 -inset-y-10 blur-3xl opacity-50"
        animate={{
          background: [
            "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(96,165,250,0.3) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main Title */}
      <h1 className={`relative z-10 text-7xl md:text-9xl font-bold ${className}`}>
        <EncryptedText
          text={text}
          revealDelayMs={50}
          interval={50}
          revealedClassName="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x"
          className="tracking-tight"
        />
      </h1>

      {/* Exploding beams effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-[2px] w-32 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
            style={{
              transformOrigin: "left center",
              rotate: `${i * 30}deg`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};
