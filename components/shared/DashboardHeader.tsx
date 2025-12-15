"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Settings } from "lucide-react";

interface DashboardHeaderProps {
  username: string;
}

export default function DashboardHeader({ username }: DashboardHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 right-0 left-64 z-30 px-8 py-6"
    >
      <div className="flex items-center justify-end gap-4">
        {/* Username */}
        <span className="text-zinc-200 font-medium text-sm">
          {username}
        </span>

        {/* Settings Button */}
        <Link href="/dashboard/settings">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
          >
            <Settings className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
          </motion.button>
        </Link>
      </div>
    </motion.header>
  );
}
