"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EncryptedTextProps {
  text: string;
  interval?: number;
  revealDelayMs?: number;
  revealedClassName?: string;
  className?: string;
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export const EncryptedText = ({
  text,
  interval = 50,
  revealDelayMs = 50,
  revealedClassName = "",
  className = "",
}: EncryptedTextProps) => {
  const [displayText, setDisplayText] = useState(text.split("").map(() => CHARACTERS[0]));
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    let currentInterval: NodeJS.Timeout;
    let revealedCount = 0;

    const revealNextChar = () => {
      if (revealedCount < text.length) {
        setDisplayText((prev) => {
          const next = [...prev];
          next[revealedCount] = text[revealedCount];
          return next;
        });
        revealedCount++;

        setTimeout(revealNextChar, revealDelayMs);
      } else {
        setIsRevealed(true);
        clearInterval(currentInterval);
      }
    };

    currentInterval = setInterval(() => {
      if (!isRevealed) {
        setDisplayText((prev) =>
          prev.map((char, i) =>
            i >= revealedCount ? CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] : char
          )
        );
      }
    }, interval);

    setTimeout(revealNextChar, 500);

    return () => {
      clearInterval(currentInterval);
    };
  }, [text, interval, revealDelayMs, isRevealed]);

  return (
    <motion.span
      className={cn(
        "font-mono transition-all duration-300",
        isRevealed ? revealedClassName : "text-zinc-500",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayText.join("")}
    </motion.span>
  );
};
