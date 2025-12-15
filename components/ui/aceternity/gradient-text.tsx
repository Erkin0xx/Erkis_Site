"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const GradientText = ({
  children,
  className,
  as: Component = "h1",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) => {
  return (
    <Component
      className={cn(
        "relative inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent",
        className
      )}
    >
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.6, 0.05, 0.01, 0.9],
        }}
        className="relative inline-block"
      >
        {children}
      </motion.span>
      {/* Glow effect */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 blur-2xl bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600"
        aria-hidden="true"
      />
    </Component>
  );
};
