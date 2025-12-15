"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  LogOut,
  User,
  Gamepad2,
  Shield,
  AlertTriangle,
  Settings,
  ArrowLeft,
  MapPin
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const dashboardNavItems: NavItem[] = [
  {
    name: "General",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "R6 Stats",
    href: "/dashboard/r6",
    icon: Target,
  },
];

const settingsNavItems: NavItem[] = [
  {
    name: "Profile Information",
    href: "/dashboard/settings",
    icon: User,
  },
  {
    name: "R6 Config",
    href: "/dashboard/settings/r6",
    icon: Gamepad2,
  },
  {
    name: "Cities",
    href: "/dashboard/settings/cities",
    icon: MapPin,
  },
  {
    name: "Account Info",
    href: "/dashboard/settings/account",
    icon: Shield,
  },
  {
    name: "Danger Zone",
    href: "/dashboard/settings/danger",
    icon: AlertTriangle,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const isSettingsPage = pathname?.startsWith('/dashboard/settings');
  const navItems = isSettingsPage ? settingsNavItems : dashboardNavItems;

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 h-screen w-64 p-4 z-40"
    >
      {/* CHANGEMENTS ICI :
         1. 'bg-black/60' au lieu de /40 -> Rend le fond très foncé, presque opaque.
         2. 'border-white/5' -> Bordure très subtile.
      */}
      <div className="h-full rounded-2xl bg-black/60 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
        
        {/* CHANGEMENT ICI :
           'opacity-10' au lieu de /30 -> La lueur violette est à peine visible, juste pour l'ambiance.
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-pink-500/20 to-purple-500/20 opacity-10 pointer-events-none" />

        {/* Content */}
        <div className="relative h-full flex flex-col p-4">
          {/* Logo */}
          <Link href="/dashboard" className="mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
            >
              Erki
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-white/10 border border-white/10 text-white" // Plus neutre, moins violet
                        : "hover:bg-white/5 text-zinc-400 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Settings Button */}
          {!isSettingsPage && (
            <Link href="/dashboard/settings">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all duration-300 mb-2"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </motion.div>
            </Link>
          )}

          {/* Back to Dashboard Button */}
          {isSettingsPage && (
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all duration-300 mb-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </motion.div>
            </Link>
          )}

          {/* Logout Button */}
          <Link href="/api/auth/signout">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.aside>
  );
}