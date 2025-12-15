"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, X, User, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

interface UserManagementTableProps {
  users: Profile[];
}

export default function UserManagementTable({
  users,
}: UserManagementTableProps) {
  const supabase = createClient() as any; // Temporary: types will be regenerated after Supabase setup
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleApprovalToggle = async (userId: string, currentStatus: boolean) => {
    setUpdating(userId);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: !currentStatus })
        .eq("id", userId);

      if (error) throw error;

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user approval status");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-xs uppercase text-muted-foreground font-medium">
              User
            </th>
            <th className="text-left py-3 px-4 text-xs uppercase text-muted-foreground font-medium">
              Role
            </th>
            <th className="text-left py-3 px-4 text-xs uppercase text-muted-foreground font-medium">
              Status
            </th>
            <th className="text-left py-3 px-4 text-xs uppercase text-muted-foreground font-medium">
              Joined
            </th>
            <th className="text-right py-3 px-4 text-xs uppercase text-muted-foreground font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              {/* User Info */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-medium">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{user.email}</p>
                    {user.full_name && (
                      <p className="text-xs text-muted-foreground">
                        {user.full_name}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="py-4 px-4">
                <div
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
                    user.role === "admin"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-blue-500/10 text-blue-400"
                  )}
                >
                  {user.role === "admin" ? (
                    <Shield className="w-3 h-3" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                  {user.role}
                </div>
              </td>

              {/* Status */}
              <td className="py-4 px-4">
                <div
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
                    user.is_approved
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  )}
                >
                  {user.is_approved ? (
                    <>
                      <Check className="w-3 h-3" />
                      Approved
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" />
                      Pending
                    </>
                  )}
                </div>
              </td>

              {/* Joined Date */}
              <td className="py-4 px-4 text-sm text-muted-foreground">
                {formatDate(user.created_at)}
              </td>

              {/* Actions */}
              <td className="py-4 px-4 text-right">
                <button
                  onClick={() => handleApprovalToggle(user.id, user.is_approved)}
                  disabled={updating === user.id}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50",
                    user.is_approved
                      ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                  )}
                >
                  {updating === user.id
                    ? "Updating..."
                    : user.is_approved
                    ? "Revoke"
                    : "Approve"}
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}
    </div>
  );
}
