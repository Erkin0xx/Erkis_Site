"use client";

import { useState, useEffect } from "react";
import { NavbarLiquid } from "@/components/shared/NavbarLiquid";
import { DottedMap } from "@/components/ui/magicui-dotted-map";
import { AuroraText } from "@/components/ui/aurora-text";
import { HoverBorderButton } from "@/components/ui/aceternity/hover-border-button";
import { LoginModal } from "@/components/features/auth/LoginModal";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { City } from "@/lib/services/cities-service";

/**
 * ERKI DASHBOARD - LANDING PAGE
 * "Dark Liquid Glass & Dotted Map" Theme
 *
 * This is the public-facing landing page with:
 * - Liquid Glass Navbar (fixed top)
 * - Interactive Dotted World Map background (Magic UI)
 * - Hybrid Encrypted Aurora Title with "Exploding Beams" effect
 * - Premium dark mode aesthetic
 */

export default function LandingPage() {
  const [markers, setMarkers] = useState<Array<{ lat: number; lng: number; size: number; blink?: boolean }>>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Fetch cities from database on mount (public endpoint)
  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch("/api/cities/public");
        if (response.ok) {
          const data = await response.json();
          if (data.cities && data.cities.length > 0) {
            // Convert cities to markers format
            const cityMarkers = data.cities.map((city: City) => ({
              lat: city.latitude,
              lng: city.longitude,
              size: 0.3,
              blink: city.status === "wishlist",
            }));
            setMarkers(cityMarkers);
          }
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    }

    fetchCities();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Fixed Liquid Glass Navbar */}
      <NavbarLiquid onLoginClick={() => setIsLoginModalOpen(true)} />

      {/* Background Effects Layer */}
      <div className="absolute inset-0">
        {/* Dotted World Map */}
        <DottedMap markers={markers} />

        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      {/* Hero Content - Lower positioned */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center pt-32 px-4">
        {/* Main Title - Aurora Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 text-center text-7xl font-bold tracking-tight md:text-9xl"
        >
          <AuroraText>Erki's site</AuroraText>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12 max-w-2xl text-center text-lg text-zinc-400 md:text-xl"
        >
          Your personal operating system. A premium dashboard experience
          designed for the future.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <HoverBorderButton
            className="group gap-2"
            onClick={() => setIsLoginModalOpen(true)}
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </HoverBorderButton>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </main>
  );
}
