import React from "react";
import { motion } from "motion/react";
import { Play, Grid3X3, Trophy, Puzzle, Settings as SettingsIcon, Dice5, RotateCcw, Info, User, Users } from "lucide-react";

// --- Sub-components for the screens ---

const SplashContent = ({ onPlay }: { onPlay: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center relative overflow-hidden">
    {/* Abstract Background Shapes */}
    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
      <div className="absolute top-10 left-10 w-32 h-32 bg-neon-blue rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-neon-pink rounded-full blur-3xl" />
    </div>

    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className="mb-16 relative"
    >
      <h1 className="font-display text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-500 drop-shadow-xl">
        GAME<br />HUB
      </h1>
      <div className="absolute -inset-4 bg-white/20 blur-xl rounded-full -z-10" />
    </motion.div>

    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onPlay}
      className="vinyl-surface pulse-glow relative flex items-center gap-3 rounded-[2rem] bg-neon-yellow px-12 py-6 text-2xl font-black text-slate-800 shadow-neon-yellow/20"
    >
      <div className="absolute inset-0 glossy-highlight rounded-[2rem] pointer-events-none" />
      <Play fill="currentColor" size={28} /> PLAY
    </motion.button>
  </div>
);

const SelectContent = () => {
  const games = [
    { name: "Checkers", icon: <Trophy className="text-red-500" size={32} />, color: "bg-red-50/50", glow: "shadow-red-200" },
    { name: "Chess", icon: <div className="text-slate-700"><Puzzle size={32} /></div>, color: "bg-slate-50/50", glow: "shadow-slate-200" },
    { name: "Sudoku", icon: <div className="font-black text-indigo-600 text-2xl">123</div>, color: "bg-indigo-50/50", glow: "shadow-indigo-200" },
    { name: "Snakes", icon: <div className="flex flex-col items-center"><span className="text-2xl">🐍</span><div className="w-4 h-0.5 bg-amber-800/30 rounded-full mt-1" /></div>, color: "bg-amber-50/50", glow: "shadow-amber-200" },
  ];

  return (
    <div className="p-8 h-full flex flex-col">
      <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Selection</h2>
      <div className="grid grid-cols-2 gap-6 flex-1">
        {games.map((game, i) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            className={`bento-card vinyl-surface ${game.color} ${game.glow} flex flex-col items-center justify-center p-6 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden`}
          >
            <div className="absolute inset-0 glossy-highlight pointer-events-none" />
            <div className="mb-3 relative">
              {game.icon}
              <div className="absolute -inset-2 bg-white/40 blur-md rounded-full -z-10" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">{game.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SettingsContent = () => (
  <div className="p-8 h-full flex flex-col">
    <div className="flex items-center justify-between mb-10">
      <h2 className="text-3xl font-black text-slate-800 tracking-tight">Config</h2>
      <button className="w-10 h-10 bento-card flex items-center justify-center text-slate-400">
        <Info size={20} />
      </button>
    </div>
    
    <div className="space-y-6 flex-1">
      <div className="bento-card p-6 bg-slate-50/50">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Difficulty</h3>
        <div className="flex gap-2">
          {['Easy', 'Medium', 'Hard'].map(level => (
            <button key={level} className={`flex-1 rounded-2xl py-3 text-xs font-black uppercase tracking-wider transition-all ${level === 'Medium' ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/30' : 'bg-white text-slate-400'}`}>
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="bento-card p-6 bg-slate-50/50">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Game Mode</h3>
        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-inner relative">
          <div className="absolute top-1.5 left-1.5 w-[calc(50%-6px)] h-[calc(100%-12px)] bg-neon-blue rounded-xl shadow-lg shadow-neon-blue/20 transition-all" />
          <button className="flex-1 py-3 text-xs font-black uppercase tracking-wider text-white relative z-10 flex items-center justify-center gap-2">
            <User size={14} /> Solo
          </button>
          <button className="flex-1 py-3 text-xs font-black uppercase tracking-wider text-slate-400 relative z-10 flex items-center justify-center gap-2">
            <Users size={14} /> MP
          </button>
        </div>
      </div>
    </div>

    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="vinyl-surface w-full rounded-[2.5rem] bg-emerald-500 py-6 text-2xl font-black text-white shadow-emerald-200 relative overflow-hidden"
    >
      <div className="absolute inset-0 glossy-highlight pointer-events-none" />
      START
    </motion.button>
  </div>
);

const GameContent = () => (
  <div className="p-6 h-full flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bento-card flex items-center justify-center text-neon-purple">
          <RotateCcw size={20} />
        </div>
        <span className="font-black text-slate-800 tracking-tight">SNAKES</span>
      </div>
      <div className="bento-card px-4 py-2 text-[10px] font-black text-slate-400 tracking-widest">
        LVL 04
      </div>
    </div>

    <div className="flex-1 bento-card bg-slate-50/50 p-4 mb-6 relative overflow-hidden preserve-3d">
      <div className="absolute inset-0 glossy-highlight pointer-events-none" />
      
      {/* 3D-ish Board */}
      <div className="grid grid-cols-4 grid-rows-4 h-full w-full gap-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="bg-white/80 rounded-xl shadow-sm" />
        ))}
      </div>

      {/* Iridescent Snake */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-lg">
        <defs>
          <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="100%" stopColor="#9d50bb" />
          </linearGradient>
        </defs>
        <path 
          d="M 40 180 C 80 140 120 220 160 100" 
          stroke="url(#snakeGrad)" 
          strokeWidth="12" 
          fill="none" 
          strokeLinecap="round" 
          className="opacity-90"
        />
      </svg>

      {/* Toy Ladder */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-12 h-32 flex gap-6 rotate-[-15deg]">
        <div className="w-2 h-full bg-amber-800/40 rounded-full" />
        <div className="w-2 h-full bg-amber-800/40 rounded-full" />
        <div className="absolute top-4 left-0 w-full h-2 bg-amber-800/40 rounded-full" />
        <div className="absolute top-12 left-0 w-full h-2 bg-amber-800/40 rounded-full" />
        <div className="absolute top-20 left-0 w-full h-2 bg-amber-800/40 rounded-full" />
      </div>
    </div>

    <div className="flex items-center gap-6">
      <motion.div 
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-20 h-20 bento-card vinyl-surface flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 glossy-highlight pointer-events-none" />
        <div className="grid grid-cols-2 gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-pink" />
          <div className="w-2 h-2 rounded-full bg-neon-blue" />
          <div className="w-2 h-2 rounded-full bg-neon-purple" />
          <div className="w-2 h-2 rounded-full bg-neon-yellow" />
        </div>
      </motion.div>
      <button className="flex-1 vinyl-surface rounded-[2rem] bg-neon-blue py-5 text-xl font-black text-white shadow-neon-blue/20 relative overflow-hidden">
        <div className="absolute inset-0 glossy-highlight pointer-events-none" />
        ROLL
      </button>
    </div>
  </div>
);

// --- Main Showcase Component ---

const MobileScreen = ({ children, index }: { children: React.ReactNode; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 100, rotateX: 35, rotateY: -35, rotateZ: 15 }}
    animate={{ 
      opacity: 1, 
      y: index * -60, 
      x: index * 140,
      rotateX: 35, 
      rotateY: -35, 
      rotateZ: 15 
    }}
    transition={{ 
      type: "spring", 
      stiffness: 40, 
      damping: 15, 
      delay: index * 0.15 
    }}
    className="absolute w-[300px] h-[600px] bento-card border-[14px] border-slate-800 bg-white overflow-hidden preserve-3d"
    style={{ 
      zIndex: 10 - index,
      boxShadow: "60px 60px 120px rgba(0,0,0,0.1), inset 0 0 30px rgba(0,0,0,0.05)"
    }}
  >
    {/* Screen Content */}
    <div className="h-full w-full bg-white relative">
      {/* Status Bar */}
      <div className="h-10 w-full flex items-center justify-between px-8 pt-3">
        <div className="text-[10px] font-black text-slate-300 tracking-widest">9:41</div>
        <div className="flex gap-1.5">
          <div className="w-4 h-1.5 rounded-full bg-slate-100" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
        </div>
      </div>
      {children}
    </div>
  </motion.div>
);

const FloatingPiece = ({ icon, delay, x, y, size = 64, color = "text-slate-300" }: { icon: React.ReactNode; delay: number; x: string; y: string; size?: number; color?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.2, 0.4, 0.2],
      y: [0, -40, 0],
      rotate: [0, 20, -20, 0],
      scale: 1
    }}
    transition={{ 
      duration: 8, 
      repeat: Infinity, 
      delay 
    }}
    className={`absolute ${color} blur-[3px] pointer-events-none`}
    style={{ left: x, top: y }}
  >
    {React.cloneElement(icon as React.ReactElement, { size })}
  </motion.div>
);

export default function Showcase({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#eef2f7] flex items-center justify-center perspective-3000">
      {/* Background Floating Pieces */}
      <FloatingPiece icon={<Trophy />} delay={0} x="5%" y="15%" size={180} color="text-red-200" />
      <FloatingPiece icon={<Dice5 />} delay={1} x="85%" y="10%" size={120} color="text-neon-yellow" />
      <FloatingPiece icon={<Puzzle />} delay={2} x="10%" y="75%" size={150} color="text-neon-blue" />
      <FloatingPiece icon={<Grid3X3 />} delay={3} x="80%" y="80%" size={140} color="text-neon-purple" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-neon-pink/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-[120px]" />

      {/* Isometric Screens Container */}
      <div className="relative w-[900px] h-[700px] flex items-center justify-center preserve-3d">
        <MobileScreen index={0}>
          <SplashContent onPlay={onEnterApp} />
        </MobileScreen>
        <MobileScreen index={1}>
          <SelectContent />
        </MobileScreen>
        <MobileScreen index={2}>
          <SettingsContent />
        </MobileScreen>
        <MobileScreen index={3}>
          <GameContent />
        </MobileScreen>
      </div>

      {/* Presentation Labels */}
      <div className="absolute bottom-16 left-16">
        <h3 className="font-display text-5xl font-black text-slate-800 tracking-tighter">GAME HUB</h3>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs mt-2">Modern Bento Design System</p>
      </div>
      
      <div className="absolute top-16 right-16 flex gap-6">
        <div className="bento-card px-8 py-4 flex items-center gap-4 bg-white/80">
          <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="text-sm font-black text-slate-600 tracking-widest uppercase">High Fidelity v2</span>
        </div>
      </div>
    </div>
  );
}
