"use client";

import { motion } from "framer-motion";
import { Lock, LogOut, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function PendingPage() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-md"
      >
        <div className="glass-card">
          {/* Animated Lock Icon */}
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/10 to-pink-500/10 rounded-full mb-6"
          >
            <Lock className="w-10 h-10 text-blue-400" />
          </motion.div>

          <h1 className="text-3xl font-bold mb-3">Access Pending</h1>

          <p className="text-muted-foreground mb-6">
            Your account has been created successfully, but it requires admin
            approval before you can access the dashboard.
          </p>

          {/* Status Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>Awaiting approval from administrator</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-left bg-white/5 border border-white/10 rounded-xl p-4 mb-6 space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">What happens next?</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>An admin will review your request</li>
              <li>You&apos;ll receive an email when approved</li>
              <li>You can then log in and access the dashboard</li>
            </ul>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-foreground font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-6">
          This is a private dashboard with restricted access.
        </p>
      </motion.div>
    </div>
  );
}
