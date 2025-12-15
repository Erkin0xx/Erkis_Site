"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface SidebarProps {
  profile: Profile;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    adminOnly: false,
  },
  {
    label: "Admin",
    href: "/dashboard/admin",
    icon: Shield,
    adminOnly: true,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    adminOnly: false,
  },
];

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || profile.role === "admin"
  );

  return (
    <div className="h-screen w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-lg">
            E
          </div>
          <div>
            <h1 className="font-bold text-lg">Erki</h1>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item, index) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1 font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="w-1.5 h-1.5 rounded-full bg-purple-500"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-white/5">
        {/* Profile Info */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-medium">
            {profile.email.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile.email}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {profile.role}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </div>
  );
}
