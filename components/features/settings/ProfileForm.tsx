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
} from "lucide-react";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileFormProps {
  profile: Profile;
}

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const supabase = createClient() as ReturnType<typeof createClient>;
  const router = useRouter();

  const [fullName, setFullName] = useState(profile.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [isProfileSaving, setIsProfileSaving] = useState(false);

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
      // @ts-ignore
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

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-black/60 border border-white/5 rounded-xl px-6 py-4 flex items-center gap-3 shadow-2xl backdrop-blur-xl"
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </motion.div>
      )}

      <div className="bg-black/60 border border-white/5 rounded-[1.5rem] p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Profile Information</h2>
            <p className="text-sm text-zinc-400">Update your personal details</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
            {avatarUrl && (
              <div className="mt-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/5 overflow-hidden border border-white/10">
                  <img
                    src={avatarUrl}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <span className="text-xs text-zinc-400">Avatar preview</span>
              </div>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-500 cursor-not-allowed"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            </div>
            <p className="mt-2 text-xs text-zinc-500">Email cannot be changed</p>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isProfileSaving}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
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
      </div>
    </>
  );
}
