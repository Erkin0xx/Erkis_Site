import { createClient } from "@/lib/supabase/server";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import DashboardHeader from "@/components/shared/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const username = user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Base black background - derrière tout */}
      <div className="fixed inset-0 -z-20 bg-black" />

      {/* BACKGROUND FX - Light Rays avec nuances bleu/violet/rose */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        
      </div>

      {/* Blurred Pink/Blue Ambient Glows - Enhanced */}

      {/* Top-right - Blue glow */}
      <div className="fixed top-0 right-0 h-[800px] w-[800px] rounded-full bg-blue-500/35 blur-[150px] pointer-events-none -z-10" />

      {/* Bottom-left - Pink glow */}
      <div className="fixed bottom-0 left-0 h-[800px] w-[800px] rounded-full bg-pink-500/30 blur-[150px] pointer-events-none -z-10" />

      {/* Center - Violet/Pink mix */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-fuchsia-500/25 blur-[140px] pointer-events-none -z-10" />

      {/* Additional accent glows */}
      <div className="fixed top-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-rose-400/20 blur-[130px] pointer-events-none -z-10" />

      {/* Sidebar */}
      <DashboardSidebar />

      {/* Header */}
      <DashboardHeader username={username} />

      {/* Main Content */}
      <main className="ml-64 pt-24 px-8 pb-8 relative z-0">
        {children}
      </main>
    </div>
  );
}
