"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, Activity, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

// Icon mapping to avoid passing components from Server to Client
const iconMap = {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  DollarSign,
};

type IconName = keyof typeof iconMap;

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  trend?: "up" | "down";
  subtitle?: string;
  icon?: IconName;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  trend = "up",
  subtitle,
  icon: iconName,
  className,
}: StatsCardProps) {
  // Resolve icon component from string name
  const Icon = iconName ? iconMap[iconName] : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn("stat-card", className)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs uppercase text-muted-foreground tracking-wider">
            {title}
          </p>
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              trend === "up"
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            )}
          >
            {trend === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <h2 className="text-3xl md:text-4xl font-bold">{value}</h2>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          {Icon && <Icon className="w-4 h-4" />}
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
