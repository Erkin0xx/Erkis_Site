"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // <--- IMPORT AJOUTÉ
import { Trophy, Target, TrendingUp, RefreshCw, History, ChevronUp, Activity, Map, Swords, Skull, Crosshair, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuroraText } from "@/components/ui/aurora-text";
import { getRankIconPath } from "@/lib/r6-ranks";

// --- DONNÉES DE TEST (Fallback) ---
const MOCK_DATA = {
  username: "e.ki",
  platform: "PC",
  level: 284,
  headshotPct: 56.4,
  killsPerMatch: 5.39,
  abandons: 21,
  history: [
    { season: "Y9S1", name: "Deadly Omen", rank: "Diamond I", mmr: 4120 },
    { season: "Y8S4", name: "Deep Freeze", rank: "Platinum I", mmr: 3850 },
    { season: "Y8S3", name: "Heavy Mettle", rank: "Platinum II", mmr: 3700 },
    { season: "Y8S2", name: "Dread Factor", rank: "Platinum III", mmr: 3550 },
    { season: "Y8S1", name: "Commanding Force", rank: "Gold I", mmr: 3200 },
    { season: "Y7S4", name: "Solar Raid", rank: "Gold II", mmr: 3050 },
    { season: "Y7S3", name: "Brutal Swarm", rank: "Gold III", mmr: 2900 },
    { season: "Y7S2", name: "Vector Glare", rank: "Silver I", mmr: 2650 },
    { season: "Y7S1", name: "Demon Veil", rank: "Silver II", mmr: 2500 },
    { season: "Y6S4", name: "High Calibre", rank: "Bronze I", mmr: 2100 },
  ],
  kd: 1.28,
  kills: 39817,
  deaths: 31078,
  winRate: 56.1,
  wins: 4147,
  losses: 3161,
  mmrHistory: [4050, 4080, 4065, 4100, 4120, 4110, 4145, 4130, 4160, 4120],
  matches: [
    { map: "Clubhouse", result: "WIN", score: "4-1", kd: 2.5, k: 10, d: 4, a: 2, date: "2h ago" },
    { map: "Chalet", result: "LOSS", score: "2-4", kd: 0.8, k: 4, d: 5, a: 1, date: "3h ago" },
    { map: "Oregon", result: "WIN", score: "4-2", kd: 1.2, k: 6, d: 5, a: 3, date: "5h ago" },
    { map: "Bank", result: "WIN", score: "4-0", kd: 3.0, k: 9, d: 3, a: 0, date: "1d ago" },
    { map: "Kafe", result: "LOSS", score: "3-5", kd: 0.9, k: 5, d: 6, a: 2, date: "1d ago" },
    { map: "Border", result: "WIN", score: "4-1", kd: 1.5, k: 8, d: 5, a: 1, date: "2d ago" },
    { map: "Consulate", result: "WIN", score: "5-3", kd: 1.1, k: 7, d: 6, a: 4, date: "2d ago" },
    { map: "Chalet", result: "WIN", score: "4-0", kd: 1.8, k: 8, d: 2, a: 1, date: "3d ago" },
  ]
};

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Délai entre l'apparition de chaque enfant
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 }, // Départ : invisible et un peu plus bas
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
        type: "spring",
        stiffness: 50,
        damping: 15
    }
  }, // Arrivée : visible et position normale
};

export default function R6Page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<any>(null);

  // Fonction pour charger les données depuis l'API Python
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/r6-stats?username=E.ki&platform=pc");
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setApiData(data);
    } catch (err: any) {
      console.error("Erreur lors du chargement des stats:", err);
      setError(err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  // Utiliser les données de l'API si disponibles, sinon fallback sur MOCK_DATA
  const data = apiData ? {
    username: apiData.profile?.username || MOCK_DATA.username,
    platform: apiData.profile?.platform?.toUpperCase() || MOCK_DATA.platform,
    level: apiData.profile?.level || MOCK_DATA.level,
    kd: apiData.rank_info?.kd || MOCK_DATA.kd,
    kills: apiData.rank_info?.kills || MOCK_DATA.kills,
    deaths: apiData.rank_info?.deaths || MOCK_DATA.deaths,
    winRate: parseFloat(apiData.rank_info?.winRate) || MOCK_DATA.winRate,
    wins: MOCK_DATA.wins, // Pas disponible dans l'API Python
    losses: MOCK_DATA.losses, // Pas disponible dans l'API Python
    rankName: apiData.rank_info?.rank?.name || "Unranked",
    rankIcon: apiData.rank_info?.rank?.icon || "",
    mmr: apiData.rank_info?.rank?.mmr || 0,
    headshotPct: MOCK_DATA.headshotPct, // Pas dans l'API Python
    killsPerMatch: MOCK_DATA.killsPerMatch, // Pas dans l'API Python
    history: MOCK_DATA.history, // Pas dans l'API Python
    matches: MOCK_DATA.matches, // Pas dans l'API Python
    mmrHistory: MOCK_DATA.mmrHistory, // Pas dans l'API Python
  } : MOCK_DATA;

  return (
    <div className="w-full h-[calc(100vh-120px)] flex flex-col overflow-hidden relative">

      {/* Glow ambiant supplémentaire */}
      <div className="fixed top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none -z-10" />

      {/* HEADER */}
      {/* On peut animer le header légèrement aussi */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-none flex items-start justify-between mb-4 pt-2 px-1"
      >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-3 h-3 text-zinc-500" />
              <p className="text-[10px] uppercase text-zinc-500 tracking-[0.3em] font-bold">Rainbow Six Siege</p>
            </div>
            <h2 className="text-5xl font-black tracking-tighter drop-shadow-xl">
              <AuroraText className="font-black">{data.username}</AuroraText>
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] text-zinc-300 font-mono uppercase">
                {data.platform}
              </span>
              <span className="text-xs text-zinc-500 font-mono">LEVEL {data.level}</span>
              {error && (
                <span className="px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-mono">
                  Mode Hors-ligne
                </span>
              )}
            </div>
          </div>
          <button onClick={handleRefresh} disabled={loading} className="p-3 bg-white/5 backdrop-blur-md rounded-full text-zinc-400 hover:text-white border border-white/10 transition-all active:scale-95 hover:bg-white/10 disabled:opacity-50">
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </button>
      </motion.div>

      {/* CONTENU PRINCIPAL - ANIMÉ */}
      {/* C'est ici que la magie opère avec "variants={containerVariants}" */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2"
      >
        
        {/* COLONNE GAUCHE : HISTORIQUE RANKS (Scrollable) */}
        <motion.div variants={itemVariants} className="lg:col-span-4 h-full min-h-0 flex flex-col bg-black/60 border border-white/5 rounded-[1.5rem] overflow-hidden shadow-2xl">
            <div className="flex-none p-4 border-b border-white/5 flex items-center gap-2 bg-white/[0.01]">
                <History className="w-3 h-3 text-zinc-400" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Rank History</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
                {data.history.map((season, i) => (
                    <div key={i} className={cn("flex items-center justify-between p-3 rounded-xl border transition-all", i === 0 ? "bg-white/10 border-white/10" : "border-transparent hover:bg-white/[0.02]")}>
                        <div className="flex items-center gap-3">
                            <img
                              src={getRankIconPath(season.rank)}
                              alt={season.rank}
                              className="w-8 h-8 object-contain grayscale-[0.5]"
                            />
                            <div>
                                <p className="text-[9px] text-zinc-600 font-mono uppercase">{season.season}</p>
                                <p className={cn("text-xs font-bold", i === 0 ? "text-white" : "text-zinc-400")}>{season.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={cn("text-xs font-black", i === 0 ? "text-white" : "text-zinc-500")}>{season.rank}</p>
                            <p className="text-[9px] text-zinc-600 font-mono">{season.mmr}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>

        {/* COLONNE DROITE */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-0 h-full">
            
            {/* 1. STATS ROW (Maintenant 4 cartes) */}
            {/* On anime aussi ce conteneur pour que les cartes arrivent une par une */}
            <motion.div variants={containerVariants} className="flex-none grid grid-cols-2 lg:grid-cols-4 gap-4 h-32">
                {/* K/D */}
                <motion.div variants={itemVariants} className="bg-black/60 border border-white/5 rounded-[1.5rem] p-5 flex flex-col justify-center relative group overflow-hidden shadow-lg ">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-zinc-500 mb-1">
                            <Target className="w-3 h-3" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">K/D Ratio</span>
                        </div>
                        <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter">{data.kd}</span>
                        <p className="text-[9px] text-zinc-500 mt-1 font-mono">{data.kills.toLocaleString('en-US')} K / {data.deaths.toLocaleString('en-US')} D</p>
                    </div>
                </motion.div>

                {/* Win Rate */}
                <motion.div variants={itemVariants} className="bg-black/60 border border-white/5 rounded-[1.5rem] p-5 flex flex-col justify-center relative group overflow-hidden shadow-lg ">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-zinc-500 mb-1">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Win Rate</span>
                        </div>
                        <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter">{data.winRate}%</span>
                        <p className="text-[9px] text-zinc-500 mt-1 font-mono">{data.wins.toLocaleString('en-US')} W / {data.losses.toLocaleString('en-US')} L</p>
                    </div>
                </motion.div>

                {/* Headshot % */}
                <motion.div variants={itemVariants} className="bg-black/60 border border-white/5 rounded-[1.5rem] p-5 flex flex-col justify-center relative group overflow-hidden shadow-lg ">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-zinc-500 mb-1">
                            <Crosshair className="w-3 h-3" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Headshot %</span>
                        </div>
                        <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter">{data.headshotPct}%</span>
                        <p className="text-[9px] text-zinc-500 mt-1 font-mono">Precision</p>
                    </div>
                </motion.div>

                {/* Kills/Match */}
                <motion.div variants={itemVariants} className="bg-black/60 border border-white/5 rounded-[1.5rem] p-5 flex flex-col justify-center relative group overflow-hidden shadow-lg ">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-zinc-500 mb-1">
                            <Zap className="w-3 h-3" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Kills/Match</span>
                        </div>
                        <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter">{data.killsPerMatch}</span>
                        <p className="text-[9px] text-zinc-500 mt-1 font-mono">Impact Rating</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* 2. HISTORIQUE DES MATCHS */}
            <motion.div variants={itemVariants} className="flex-1 bg-black/60 border border-white/5 rounded-[1.5rem] overflow-hidden shadow-lg flex flex-col min-h-0">
                <div className="flex-none p-4 border-b border-white/5 flex items-center gap-2 bg-white/[0.01]">
                    <Swords className="w-3 h-3 text-zinc-400" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Recent Matches</span>
                </div>
                
                {/* Zone Scrollable */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
                    {data.matches.map((match, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-lg border", match.result === "WIN" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400")}>
                                    <Map className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors">{match.map}</p>
                                    <p className="text-[9px] text-zinc-500 font-mono uppercase">{match.date} • Ranked</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className={cn("text-lg font-black tracking-widest", match.result === "WIN" ? "text-white" : "text-zinc-500")}>
                                    {match.score}
                                </span>
                                <span className={cn("text-[9px] font-bold uppercase", match.result === "WIN" ? "text-emerald-500" : "text-red-500")}>
                                    {match.result}
                                </span>
                            </div>

                            <div className="text-right min-w-[80px]">
                                <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-white">
                                    <Skull className="w-3 h-3 text-zinc-500" />
                                    {match.k} <span className="text-zinc-600">/</span> {match.d} <span className="text-zinc-600">/</span> {match.a}
                                </div>
                                <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{match.kd} KD</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* 3. GRAPHIQUE ELO */}
            <motion.div variants={itemVariants} className="h-52 flex-none bg-black/60 border border-white/5 rounded-[1.5rem] p-5 relative overflow-hidden flex flex-col shadow-lg">
                <div className="flex-none flex items-center justify-between mb-2 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white/10 text-white border border-white/10">
                            <Activity className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">MMR Trend</p>
                            <p className="text-xs font-medium text-zinc-300">Last 10 Matches</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-black text-white tracking-tight">{data.mmrHistory[data.mmrHistory.length - 1]}</p>
                        <p className="text-[9px] text-zinc-400 font-bold flex items-center justify-end gap-1">
                            <ChevronUp className="w-3 h-3 text-white" /> +24
                        </p>
                    </div>
                </div>
                {/* SVG Graph */}
                <div className="flex-1 w-full relative min-h-0">
                    <div className="absolute inset-0 grid grid-rows-4 w-full h-full border-t border-b border-white/[0.03]">
                        {[...Array(4)].map((_, i) => <div key={i} className="border-b border-white/[0.03] w-full h-full" />)}
                    </div>
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="gradientWhite" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M0,100 Q10,90 20,85 T40,80 T60,60 T80,65 T100,50 T120,55 T140,40 T160,45 T180,30 V100 H0 Z" fill="url(#gradientWhite)" className="w-full h-full vector-effect-non-scaling-stroke transform scale-y-90 origin-bottom" style={{ transformBox: "fill-box" }} />
                        <path d="M0,80 Q20,70 40,65 T80,60 T120,40 T160,45 T200,30 T240,35 T280,20 T320,25" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" className="w-full h-full vector-effect-non-scaling-stroke drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                    </svg>
                </div>
            </motion.div>

        </div>
      </motion.div>
    </div>
  );
}