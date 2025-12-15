"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type HoverBorderButtonProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  as?: React.ElementType;
} & React.ComponentPropsWithoutRef<"button">;

export const HoverBorderButton = ({
  children,
  className,
  containerClassName,
  as: Component = "button",
  ...props
}: HoverBorderButtonProps) => {
  return (
    <Component
      className={cn(
        "relative inline-flex overflow-hidden rounded-2xl p-[1px] focus:outline-none",
        containerClassName
      )}
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a855f7_0%,#ec4899_50%,#a855f7_100%)]" />
      <span
        className={cn(
          "inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-zinc-950 px-8 py-3 text-sm font-medium text-zinc-200 backdrop-blur-3xl transition-all hover:bg-zinc-900/80",
          className
        )}
      >
        {children}
      </span>
    </Component>
  );
};
