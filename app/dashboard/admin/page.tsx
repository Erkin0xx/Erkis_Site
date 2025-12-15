import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UserManagementTable from "@/components/features/admin/UserManagementTable";
import { Shield } from "lucide-react";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user is admin
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: string }>();

  if (error || !profile || profile.role !== "admin") {
    redirect("/");
  }

  // Fetch all users
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Profile[]>();

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage users and system settings
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6">
          <p className="text-xs uppercase text-muted-foreground mb-2">
            Total Users
          </p>
          <p className="text-3xl font-bold">{users?.length || 0}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-xs uppercase text-muted-foreground mb-2">
            Approved
          </p>
          <p className="text-3xl font-bold text-green-400">
            {users?.filter((u) => u.is_approved).length || 0}
          </p>
        </div>
        <div className="glass-card p-6">
          <p className="text-xs uppercase text-muted-foreground mb-2">
            Pending
          </p>
          <p className="text-3xl font-bold text-yellow-400">
            {users?.filter((u) => !u.is_approved).length || 0}
          </p>
        </div>
      </div>

      {/* User Management Table */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <UserManagementTable users={users || []} />
      </div>
    </div>
  );
}
