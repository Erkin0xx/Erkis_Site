"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Loader2, X } from "lucide-react";
import { AuroraText } from "@/components/ui/aurora-text";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        setMessage(
          "Account created! Check your email for verification. After verifying, wait for admin approval."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.push("/dashboard");
        router.refresh();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 rounded-full bg-white/10 p-2 text-white/60 backdrop-blur-xl transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="glass-card">
                {/* Logo/Title */}
                <div className="mb-8 text-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <h1 className="mb-2 text-4xl font-bold">
                      <AuroraText>Erki</AuroraText>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Personal Operating System
                    </p>
                  </motion.div>
                </div>

                {/* Auth Form */}
                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="you@example.com"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
                    >
                      {error}
                    </motion.div>
                  )}

                  {message && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400"
                    >
                      {message}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 font-medium text-white transition-all duration-300 hover:from-purple-600 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <LogIn className="h-5 w-5" />
                    )}
                    {isLoading
                      ? "Processing..."
                      : isSignUp
                        ? "Sign Up"
                        : "Sign In"}
                  </button>
                </form>

                {/* Toggle Sign Up/Sign In */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                      setMessage(null);
                    }}
                    disabled={isLoading}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {isSignUp
                      ? "Already have an account? Sign in"
                      : "Don't have an account? Sign up"}
                  </button>
                </div>

                {/* Footer Note */}
                <p className="mt-6 text-center text-xs text-muted-foreground">
                  This is a private dashboard. New accounts require admin
                  approval.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
