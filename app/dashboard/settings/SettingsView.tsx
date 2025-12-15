"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon, Sliders } from "lucide-react";
import { AuroraText } from "@/components/ui/aurora-text";
import SettingsForm from "@/components/features/settings/SettingsForm";
import { CitiesManagement } from "@/components/features/settings/CitiesManagement";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface SettingsViewProps {
  profile: Profile;
}

// --- ANIMATIONS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
};

export default function SettingsView({ profile }: SettingsViewProps) {
  return (
    <div className="min-h-screen relative overflow-hidden pb-24">

      {/* Glows d'ambiance */}
      <div className="fixed top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none -z-10" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-4 md:p-8 max-w-5xl mx-auto space-y-8"
      >
        {/* HEADER */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center shadow-lg">
            <SettingsIcon className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
                <Sliders className="w-3 h-3 text-blue-400" />
                <p className="text-[10px] uppercase text-blue-400 tracking-[0.3em] font-bold">Preferences</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              <AuroraText className="from-blue-400 via-purple-400 to-blue-400">Settings</AuroraText>
            </h1>
          </div>
        </motion.div>

        {/* SECTION 1: PROFILE FORM */}
        {/* On enveloppe le formulaire existant dans notre conteneur stylé */}
        <motion.div variants={itemVariants}>
           {/* Note: Si SettingsForm a déjà ses propres "cards", assure-toi qu'elles utilisent 'bg-black/60' et 'border-white/5'. 
               Sinon, tu peux envelopper ici. */}
           <SettingsForm profile={profile} />
        </motion.div>

        {/* DIVIDER STYLÉ */}
        <motion.div variants={itemVariants} className="relative py-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-zinc-500 font-mono">Zones & Data</span>
            </div>
        </motion.div>

        {/* SECTION 2: CITIES MANAGEMENT */}
        <motion.div variants={itemVariants}>
            <CitiesManagement />
        </motion.div>

      </motion.div>
    </div>
  );
}