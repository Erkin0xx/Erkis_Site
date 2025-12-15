"use client";

import * as React from "react";
import { createMap } from "svg-dotted-map";
import { motion, AnimatePresence, type SVGMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface Marker {
  lat: number;
  lng: number;
  size?: number;
  blink?: boolean;
}

export interface DottedMapProps extends Omit<SVGMotionProps<SVGSVGElement>, 'width' | 'height'> {
  width?: number;
  height?: number;
  mapSamples?: number;
  markers?: Marker[];
  dotColor?: string;
  markerColor?: string;
  dotRadius?: number;
  stagger?: boolean;
}

export function DottedMap({
  width = 150,
  height = 75,
  mapSamples = 5500,
  markers = [],
  markerColor = "#3b82f6",
  dotRadius = 0.08,
  stagger = true,
  className,
  style,
  ...props
}: DottedMapProps) {
  const { points, addMarkers } = createMap({
    width,
    height,
    mapSamples,
  });

  const processedMarkers = addMarkers(markers);

  // State to track which marker is currently "pinging"
  const [activeMarkerIndex, setActiveMarkerIndex] = React.useState<number | null>(null);

  // Sequential ping animation cycle
  React.useEffect(() => {
    if (processedMarkers.length === 0) return;

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const cycleThroughMarkers = () => {
      // Activate current marker
      setActiveMarkerIndex(currentIndex);

      // Duration for ping animation (3s) + pause before next city (0.5s)
      timeoutId = setTimeout(() => {
        currentIndex++;

        if (currentIndex >= processedMarkers.length) {
          // All cities pinged - longer pause before restarting cycle
          setActiveMarkerIndex(null);
          timeoutId = setTimeout(() => {
            currentIndex = 0;
            cycleThroughMarkers();
          }, 2000); // 2 second pause before restarting
        } else {
          cycleThroughMarkers();
        }
      }, 3500); // 3.5 seconds per city (3s animation + 0.5s pause)
    };

    // Start the cycle
    cycleThroughMarkers();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [processedMarkers.length]);

  // Compute stagger helpers in a single, simple pass
  const { xStep, yToRowIndex } = React.useMemo(() => {
    const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x);
    const rowMap = new Map<number, number>();
    let step = 0;
    let prevY = Number.NaN;
    let prevXInRow = Number.NaN;

    for (const p of sorted) {
      if (p.y !== prevY) {
        // new row
        prevY = p.y;
        prevXInRow = Number.NaN;
        if (!rowMap.has(p.y)) rowMap.set(p.y, rowMap.size);
      }
      if (!Number.isNaN(prevXInRow)) {
        const delta = p.x - prevXInRow;
        if (delta > 0) step = step === 0 ? delta : Math.min(step, delta);
      }
      prevXInRow = p.x;
    }

    return { xStep: step || 1, yToRowIndex: rowMap };
  }, [points]);

  return (
    <motion.svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn(
        "absolute inset-0 pointer-events-none text-white/55",
        className
      )}
      style={{ width: "100%", height: "100%", ...style }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      {...props}
    >
      {points.map((point, index) => {
        const rowIndex = yToRowIndex.get(point.y) ?? 0;
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
        return (
          <circle
            cx={point.x + offsetX}
            cy={point.y}
            r={dotRadius}
            fill="currentColor"
            key={`${point.x}-${point.y}-${index}`}
          />
        );
      })}
      {processedMarkers.map((marker, index) => {
        const rowIndex = yToRowIndex.get(marker.y) ?? 0;
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;

        return (
          <motion.g
            key={`marker-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            {/* Neon Pulse - Radar Effect */}

            {/* Radar ping circles - always visible for active marker */}
            <AnimatePresence>
              {activeMarkerIndex === index && (
                <>
                  {/* Cercle 1 - Cyan */}
                  <motion.circle
                    key={`ping1-${index}`}
                    cx={marker.x + offsetX}
                    cy={marker.y}
                    r={(marker.size ?? dotRadius) * 2}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="0.12"
                    initial={{ r: (marker.size ?? dotRadius) * 1.5, opacity: 0.8 }}
                    animate={{
                      r: [(marker.size ?? dotRadius) * 1.5, (marker.size ?? dotRadius) * 9],
                      opacity: [0.8, 0]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2,
                      ease: "easeOut",
                      repeat: Infinity,
                      repeatDelay: 0.3
                    }}
                  />
                  {/* Cercle 2 - Magenta */}
                  <motion.circle
                    key={`ping2-${index}`}
                    cx={marker.x + offsetX}
                    cy={marker.y}
                    r={(marker.size ?? dotRadius) * 2}
                    fill="none"
                    stroke="#d946ef"
                    strokeWidth="0.1"
                    initial={{ r: (marker.size ?? dotRadius) * 1.5, opacity: 0.6 }}
                    animate={{
                      r: [(marker.size ?? dotRadius) * 1.5, (marker.size ?? dotRadius) * 11],
                      opacity: [0.6, 0]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2.2,
                      ease: "easeOut",
                      repeat: Infinity,
                      repeatDelay: 0.3,
                      delay: 0.4
                    }}
                  />
                  {/* Cercle 3 - Cyan clair */}
                  <motion.circle
                    key={`ping3-${index}`}
                    cx={marker.x + offsetX}
                    cy={marker.y}
                    r={(marker.size ?? dotRadius) * 2}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="0.08"
                    initial={{ r: (marker.size ?? dotRadius) * 1.5, opacity: 0.5 }}
                    animate={{
                      r: [(marker.size ?? dotRadius) * 1.5, (marker.size ?? dotRadius) * 13],
                      opacity: [0.5, 0]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2.4,
                      ease: "easeOut",
                      repeat: Infinity,
                      repeatDelay: 0.3,
                      delay: 0.7
                    }}
                  />
                </>
              )}
            </AnimatePresence>

            {/* Subtle glow behind center dot */}
            <circle
              cx={marker.x + offsetX}
              cy={marker.y}
              r={(marker.size ?? dotRadius) * 3}
              fill={marker.blink ? "#d946ef" : "#06b6d4"}
              opacity="0.15"
              style={{ filter: "blur(2px)" }}
            />

            {/* Center dot - white/pale pink */}
            <motion.circle
              cx={marker.x + offsetX}
              cy={marker.y}
              r={(marker.size ?? dotRadius) * 1.3}
              fill={marker.blink ? "#fce7f3" : "#ffffff"}
              opacity="0.95"
              style={{
                filter: marker.blink
                  ? "drop-shadow(0 0 3px rgba(217, 70, 239, 0.8))"
                  : "drop-shadow(0 0 3px rgba(6, 182, 212, 0.6))"
              }}
              animate={
                marker.blink
                  ? {
                      opacity: [0.95, 0.5, 0.95],
                      scale: [1, 1.25, 1],
                    }
                  : {}
              }
              transition={
                marker.blink
                  ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : {}
              }
            />
          </motion.g>
        );
      })}

      {/* Vignette effect - darkens edges */}
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <stop offset="70%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.6" />
        </radialGradient>

        {/* Scanlines pattern */}
        <pattern id="scanlines" x="0" y="0" width="1" height="4" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="100%" height="1" fill="rgba(255, 255, 255, 0.02)" />
          <rect x="0" y="1" width="100%" height="3" fill="transparent" />
        </pattern>
      </defs>

      {/* Apply vignette */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#vignette)"
        pointerEvents="none"
      />

      {/* Apply scanlines */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#scanlines)"
        pointerEvents="none"
        opacity="0.4"
      />
    </motion.svg>
  );
}
