"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LogIn } from "lucide-react";

interface NavbarLiquidProps {
  onLoginClick?: () => void;
}

export const NavbarLiquid = ({ onLoginClick }: NavbarLiquidProps) => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="mx-auto max-w-7xl">
        {/* Liquid Glass Container */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl">
          {/* Gradient border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />

          {/* Content */}
          <div className="relative flex items-center justify-between px-6 py-3">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
              >
                Erki
              </motion.div>
            </Link>

            {/* Login Button */}
            {onLoginClick ? (
              <motion.button
                onClick={onLoginClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-zinc-200 transition-all hover:bg-white/10"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </span>

                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.button>
            ) : (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-zinc-200 transition-all hover:bg-white/10"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </span>

                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
