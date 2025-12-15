"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shield, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface MobileNavProps {
  profile: Profile;
}

const navItems = [
  {
    label: "Home",
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

export default function MobileNav({ profile }: MobileNavProps) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || profile.role === "admin"
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-t border-white/10 safe-bottom z-50">
      <nav className="h-full flex items-center justify-around px-4">
        {filteredNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 touch-feedback",
                isActive ? "text-white" : "text-muted-foreground"
              )}
            >
              <item.icon
                className={cn("w-6 h-6", isActive && "text-purple-500")}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
