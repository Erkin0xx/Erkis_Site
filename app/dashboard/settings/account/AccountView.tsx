"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

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

interface AccountViewProps {
  profile: any;
  userId: string;
}

export default function AccountView({ profile, userId }: AccountViewProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Account Information Card */}
      <motion.div
        variants={itemVariants}
        className="bg-black/60 border border-white/5 rounded-[1.5rem] p-8 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Account Information</h2>
            <p className="text-sm text-zinc-400">View your account details</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Role
            </label>
            <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30">
                {profile.role === "admin" ? "Admin" : "User"}
              </span>
            </div>
          </div>

          {/* Account Status */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Account Status
            </label>
            <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-green-500/20 text-green-300 text-sm font-medium border border-green-500/30">
                {profile.approved ? "Approved" : "Pending Approval"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
