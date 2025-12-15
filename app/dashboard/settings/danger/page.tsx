"use client";

import { motion } from "framer-motion";
import { AlertTriangle, LogOut } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 15
    }
  },
};

export default function DangerZonePage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Danger Zone Card */}
      <motion.div
        variants={itemVariants}
        className="bg-black/60 border border-red-500/20 rounded-[1.5rem] p-8 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-500">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Danger Zone</h2>
            <p className="text-sm text-zinc-400">Irreversible account actions</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Logout Warning */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 hover:bg-red-500/[0.12] transition-colors">
            <div className="flex items-start gap-3">
              <LogOut className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Sign Out</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Logging out will end your current session. You will need to sign in again to access your dashboard.
                </p>
                <a
                  href="/api/auth/signout"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 active:scale-[0.98]"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </a>
              </div>
            </div>
          </div>

          {/* Delete Account Warning (Disabled) */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 opacity-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-zinc-500 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-zinc-400 font-semibold mb-2">Delete Account</h3>
                <p className="text-sm text-zinc-500 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 text-zinc-500 font-semibold rounded-xl cursor-not-allowed"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Delete Account (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
