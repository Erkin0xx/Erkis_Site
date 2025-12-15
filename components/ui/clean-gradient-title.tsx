"use client";

import { motion } from "framer-motion";

interface CleanGradientTitleProps {
  text: string;
  className?: string;
}

export const CleanGradientTitle = ({ text, className = "" }: CleanGradientTitleProps) => {
  return (
    <div className="relative">
      {/* Aurora glow background effect */}
      <motion.div
        className="absolute -inset-x-20 -inset-y-10 blur-3xl opacity-40"
        animate={{
          background: [
            "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main Title - Clean and Sharp */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative z-10 text-7xl md:text-9xl font-bold tracking-tight ${className}`}
        style={{
          background: "linear-gradient(to right, #3b82f6, #a855f7, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textRendering: "geometricPrecision",
          WebkitFontSmoothing: "subpixel-antialiased",
          MozOsxFontSmoothing: "auto",
          fontSmooth: "always",
          filter: "contrast(1.1)",
        }}
      >
        {text}
      </motion.h1>
    </div>
  );
};
