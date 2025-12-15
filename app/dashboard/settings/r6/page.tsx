"use client";

import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";

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

export default function R6ConfigPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Rainbow Six Config Card */}
      <motion.div
        variants={itemVariants}
        className="bg-black/60 border border-white/5 rounded-[1.5rem] p-8 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Rainbow Six Config</h2>
            <p className="text-sm text-zinc-400">Set your default R6 preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* R6 Username */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              R6 Username
            </label>
            <input
              type="text"
              placeholder="Enter your R6 username"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Platform
            </label>
            <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all">
              <option value="pc">PC (Ubisoft Connect)</option>
              <option value="psn">PlayStation Network</option>
              <option value="xbl">Xbox Live</option>
            </select>
          </div>

          {/* Info Text */}
          <p className="text-sm text-blue-400/80 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            This configuration will be used as the default for displaying your Rainbow Six Siege stats on the dashboard.
          </p>

          {/* Save Button */}
          <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/25 active:scale-[0.98]">
            Save Configuration
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
