// @ts-nocheck
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
  Shield,
  Calendar,
  Clock,
  LogOut,
  Gamepad2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface SettingsFormProps {
  profile: Profile;
}

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export default function SettingsForm({ profile }: SettingsFormProps) {
  const supabase = createClient() as ReturnType<typeof createClient>;
  const router = useRouter();

  // Profile form state
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // R6 form state
  const [r6Username, setR6Username] = useState(profile.r6_username || "");
  const [r6Platform, setR6Platform] = useState<"pc" | "psn" | "xbl">(
    profile.r6_platform || "pc"
  );
  const [isR6Saving, setIsR6Saving] = useState(false);

  // Logout state
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Toast state
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSaving(true);

    try {
      // @ts-ignore - Supabase type inference issue
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName || null,
          avatar_url: avatarUrl || null,
        })
        .eq("id", profile.id);

      if (error) throw error;

      showToast("Profile updated successfully!", "success");
      router.refresh();
    } catch (error) {
      console.error("Failed to update profile:", error);
      showToast("Failed to update profile. Please try again.", "error");
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleR6Save = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsR6Saving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          r6_username: r6Username || null,
          r6_platform: r6Platform,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      showToast("R6 configuration saved successfully!", "success");
      router.refresh();
    } catch (error) {
      console.error("Failed to update R6 config:", error);
      showToast("Failed to update R6 configuration. Please try again.", "error");
    } finally {
      setIsR6Saving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRelativeTime = (dateString: string | null) => {
    if (!dateString) return "Never";

    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 glass-card px-6 py-4 flex items-center gap-3 shadow-2xl"
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <p className="text-sm text-muted-foreground">
                Update your personal details
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            {/* Avatar URL */}
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium mb-2"
              >
                Avatar URL
              </label>
              <input
                id="avatar"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              {avatarUrl && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 overflow-hidden">
                    <img
                      src={avatarUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Avatar preview
                  </span>
                </div>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl opacity-50 cursor-not-allowed"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isProfileSaving}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProfileSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Rainbow Six Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Rainbow Six Config</h2>
              <p className="text-sm text-muted-foreground">
                Set your default R6 preferences
              </p>
            </div>
          </div>

          <form onSubmit={handleR6Save} className="space-y-4">
            {/* R6 Username */}
            <div>
              <label
                htmlFor="r6Username"
                className="block text-sm font-medium mb-2"
              >
                R6 Username
              </label>
              <input
                id="r6Username"
                type="text"
                value={r6Username}
                onChange={(e) => setR6Username(e.target.value)}
                placeholder="Enter your R6 username"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Platform Dropdown */}
            <div>
              <label
                htmlFor="r6Platform"
                className="block text-sm font-medium mb-2"
              >
                Platform
              </label>
              <select
                id="r6Platform"
                value={r6Platform}
                onChange={(e) =>
                  setR6Platform(e.target.value as "pc" | "psn" | "xbl")
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="pc" className="bg-zinc-900">
                  PC (Ubisoft Connect)
                </option>
                <option value="psn" className="bg-zinc-900">
                  PlayStation Network
                </option>
                <option value="xbl" className="bg-zinc-900">
                  Xbox Live
                </option>
              </select>
            </div>

            {/* Info Note */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-xs text-blue-400">
                This configuration will be used as the default for displaying
                your Rainbow Six Siege stats on the dashboard.
              </p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isR6Saving}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isR6Saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Configuration
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Account Information</h2>
              <p className="text-sm text-muted-foreground">
                View your account details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium",
                  profile.role === "admin"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                )}
              >
                <Shield className="w-4 h-4" />
                {profile.role === "admin" ? "Administrator" : "User"}
              </div>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Member Since
              </label>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(profile.created_at)}</span>
              </div>
            </div>

            {/* Last Seen */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Last Seen
              </label>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{getRelativeTime(profile.last_seen)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 border-red-500/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-400">
                Danger Zone
              </h2>
              <p className="text-sm text-muted-foreground">
                Irreversible account actions
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-sm text-red-400">
                Logging out will end your current session. You will need to log
                in again to access your account.
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  Logout
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
