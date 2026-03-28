import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  ChevronRight, 
  Trophy, 
  Grid3X3,
  Circle,
  Hash,
  ArrowRight,
  RotateCcw,
  Settings as SettingsIcon,
  Cpu
} from "lucide-react";
import Checkers from "./Checkers";
import Chess from "./Chess";
import Sudoku from "./Sudoku";
import SnakeLadder from "./SnakeLadder";

type Screen = 'showcase' | 'splash' | 'selection' | 'settings' | 'game';
type GameType = 'checkers' | 'chess' | 'sudoku' | 'snake';

export default function GameHub() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('showcase');
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [mode, setMode] = useState<'ai' | 'multiplayer'>('ai');

  const games = [
    { id: 'checkers', name: 'Checkers', icon: <Circle className="text-neon-pink" />, color: 'neon-pink-glow' },
    { id: 'chess', name: 'Chess', icon: <Trophy className="text-neon-cyan" />, color: 'neon-cyan-glow' },
    { id: 'sudoku', name: 'Sudoku', icon: <Hash className="text-neon-amber" />, color: 'neon-amber-glow' },
    { id: 'snake', name: 'Snake', icon: <Grid3X3 className="text-neon-green" />, color: 'neon-green-glow' },
  ];

  const howToPlay: Record<GameType, string> = {
    chess: "Move your pieces to checkmate the opponent's king. Each piece has unique movement rules. Use strategy to control the board.",
    checkers: "Jump over opponent's pieces to capture them. Reach the other side to become a king. Capture all pieces to win.",
    sudoku: "Fill the 9x9 grid so that each row, column, and 3x3 box contains all digits from 1 to 9 without repetition.",
    snake: "Roll the dice to move your token. Climb ladders to go up and avoid snakes that pull you down. Reach 100 first to win."
  };

  const renderGame = () => {
    switch (selectedGame) {
      case 'checkers': return <Checkers mode={mode} onHome={() => setCurrentScreen('selection')} />;
      case 'chess': return <Chess mode={mode} onHome={() => setCurrentScreen('selection')} />;
      case 'sudoku': return <Sudoku difficulty={difficulty} onHome={() => setCurrentScreen('selection')} />;
      case 'snake': return <SnakeLadder mode={mode} onHome={() => setCurrentScreen('selection')} />;
      default: return null;
    }
  };

  // Mini Screens for Showcase
  const MiniSplash = () => (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center bg-charcoal">
      <motion.h1 
        className="mb-12 font-display text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-neon-pink to-neon-purple drop-shadow-[0_0_15px_rgba(255,0,255,0.5)]"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        GAME<br/>HUB
      </motion.h1>
      <div className="skeuo-button neon-cyan-glow px-8 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-widest">
        PLAY
      </div>
    </div>
  );

  const MiniSelection = () => (
    <div className="p-6 h-full flex flex-col bg-charcoal">
      <h2 className="mb-4 font-display text-sm font-bold text-white/60 uppercase tracking-widest">Select Game</h2>
      <div className="grid grid-cols-2 gap-3 flex-1">
        {games.map((game) => (
          <div key={game.id} className={`skeuo-card ${game.color} rounded-xl p-3 flex flex-col items-center justify-center gap-1 border`}>
            <div className="p-1 bg-white/5 rounded-lg scale-75">{game.icon}</div>
            <span className="text-[8px] font-bold uppercase tracking-tighter text-white/40">{game.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const MiniSettings = () => (
    <div className="p-6 h-full flex flex-col justify-between bg-charcoal">
      <div>
        <h2 className="mb-4 font-display text-sm font-bold text-white/60 uppercase tracking-widest">Settings</h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[8px] uppercase font-bold text-white/30">Difficulty</span>
            <div className="flex gap-1">
              {['Easy', 'Med', 'Hard'].map(d => (
                <div key={d} className={`flex-1 py-1 text-center rounded-md text-[8px] font-bold ${d === 'Med' ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50' : 'bg-white/5 text-white/20'}`}>
                  {d}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] uppercase font-bold text-white/30">Mode</span>
            <div className="flex gap-1">
              <div className="flex-1 py-1 text-center rounded-md text-[8px] font-bold bg-neon-purple/20 text-neon-purple border border-neon-purple/50">Solo</div>
              <div className="flex-1 py-1 text-center rounded-md text-[8px] font-bold bg-white/5 text-white/20">Multi</div>
            </div>
          </div>
        </div>
      </div>
      <div className="skeuo-button neon-cyan-glow w-full py-2 rounded-lg font-display font-bold text-[10px] uppercase tracking-widest text-center">
        START GAME
      </div>
    </div>
  );

  const MiniGame = () => (
    <div className="p-4 h-full flex flex-col bg-charcoal">
      <div className="flex justify-between items-center mb-4">
        <div className="skeuo-card px-2 py-0.5 rounded-full text-[6px] font-bold text-neon-cyan border-neon-cyan/30">LEVEL 04</div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-neon-pink shadow-[0_0_5px_rgba(255,0,255,0.8)]" />
          <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
        </div>
      </div>
      <div className="flex-1 skeuo-card rounded-xl relative overflow-hidden p-1 border-white/5">
        <div className="grid grid-cols-4 grid-rows-3 gap-0.5 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-sm border border-white/5" />
          ))}
        </div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none p-1" viewBox="0 0 100 100">
          <path 
            d="M 12.5 16.6 L 37.5 16.6 L 37.5 50 L 62.5 50 L 62.5 83.3" 
            fill="none" 
            stroke="#9d00ff" 
            strokeWidth="4" 
            strokeLinecap="round" 
            className="drop-shadow-[0_0_5px_rgba(157,0,255,0.8)]"
          />
          <circle cx="62.5" cy="83.3" r="3" fill="#9d00ff" className="animate-pulse" />
          <line x1="87.5" y1="16.6" x2="87.5" y2="83.3" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="82.5" y1="16.6" x2="82.5" y2="83.3" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
        </svg>
      </div>
    </div>
  );

  const Showcase = () => (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-center overflow-x-hidden py-10 lg:py-20 bg-charcoal px-4">
      {/* Background Light Trails */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="light-trail top-1/4 left-[-10%] opacity-20" />
        <div className="light-trail top-1/2 left-[-20%] opacity-10" />
        <div className="light-trail top-3/4 left-[-5%] opacity-15" />
      </div>

      {/* Floating Elements (Desktop only) */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-[15%] left-[10%] text-neon-pink/30"><Trophy size={120} /></motion.div>
        <motion.div animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute bottom-[15%] right-[10%] text-neon-cyan/20"><RotateCcw size={100} /></motion.div>
      </div>

      {/* Diagonal Cascade / Vertical Stack */}
      <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-0 lg:translate-x-[-5%] z-10 w-full max-w-7xl justify-center">
        {[
          { id: 'splash', component: <MiniSplash />, offset: 'lg:translate-y-[-60px] lg:rotate-[-8deg]', z: 'z-40' },
          { id: 'selection', component: <MiniSelection />, offset: 'lg:translate-y-[-20px] lg:rotate-[-4deg]', z: 'z-30' },
          { id: 'settings', component: <MiniSettings />, offset: 'lg:translate-y-[20px] lg:rotate-[4deg]', z: 'z-20' },
          { id: 'game', component: <MiniGame />, offset: 'lg:translate-y-[60px] lg:rotate-[8deg]', z: 'z-10' }
        ].map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 50, y: 50 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
            className={`showcase-frame ${item.offset} ${item.z} hover:scale-105 hover:rotate-0 transition-all duration-500 cursor-pointer group shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}
            onClick={() => {
              if (item.id === 'splash') setCurrentScreen('splash');
              else if (item.id === 'selection') setCurrentScreen('selection');
              else if (item.id === 'settings') { setSelectedGame('snake'); setCurrentScreen('settings'); }
              else if (item.id === 'game') { setSelectedGame('snake'); setCurrentScreen('game'); }
            }}
          >
            <div className="h-full w-full bg-charcoal relative">
              {item.component}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            </div>
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1a1a1a] rounded-b-2xl" />
          </motion.div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-12 lg:absolute lg:bottom-10 flex flex-col items-center gap-4 z-50">
        <p className="font-display text-white/20 uppercase tracking-[0.5em] text-[10px] text-center">Click a device to enter or use the button below</p>
        <div className="flex gap-4">
          <button 
            onClick={() => setCurrentScreen('splash')}
            className="skeuo-button neon-cyan-glow px-10 py-3 rounded-full font-bold text-xs flex items-center gap-2"
          >
            ENTER APP <ArrowRight size={16} />
          </button>
          <button 
            onClick={() => setCurrentScreen('selection')}
            className="skeuo-button neon-purple-glow px-10 py-3 rounded-full font-bold text-xs flex items-center gap-2"
          >
            QUICK START <Play size={16} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-charcoal">
      <AnimatePresence mode="wait">
        {currentScreen === 'showcase' ? (
          <motion.div key="showcase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Showcase />
          </motion.div>
        ) : currentScreen === 'splash' ? (
          <motion.div 
            key="splash" 
            className="flex min-h-screen flex-col items-center justify-center bg-charcoal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <div className="mobile-frame flex flex-col items-center justify-center p-6">
              <motion.h1 
                className="mb-16 font-display text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-neon-pink to-neon-purple drop-shadow-[0_0_20px_rgba(255,0,255,0.6)] text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                GAME<br/>HUB
              </motion.h1>
              <button 
                onClick={() => setCurrentScreen('selection')}
                className="skeuo-button neon-cyan-glow px-16 py-6 rounded-3xl font-display font-bold text-2xl uppercase tracking-widest flex items-center gap-4"
              >
                <Play fill="currentColor" /> PLAY
              </button>
              <button 
                onClick={() => setCurrentScreen('showcase')}
                className="mt-12 text-white/20 hover:text-white/40 font-bold uppercase tracking-widest text-xs"
              >
                Back to Showcase
              </button>
            </div>
          </motion.div>
        ) : currentScreen === 'selection' ? (
          <motion.div 
            key="selection" 
            className="flex min-h-screen flex-col items-center justify-center bg-charcoal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mobile-frame p-8 flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-display text-2xl font-bold text-white uppercase tracking-widest">Select Game</h2>
                <button onClick={() => setCurrentScreen('showcase')} className="p-2 skeuo-button rounded-xl text-white/40"><RotateCcw size={20}/></button>
              </div>
              <div className="grid grid-cols-2 gap-6 flex-1">
                {games.map((game) => (
                  <motion.button
                    key={game.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedGame(game.id as GameType);
                      setCurrentScreen('settings');
                    }}
                    className={`skeuo-card ${game.color} rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 border-2 transition-all`}
                  >
                    <div className="p-4 bg-white/5 rounded-2xl scale-125">{game.icon}</div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60">{game.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : currentScreen === 'settings' ? (
          <motion.div 
            key="settings" 
            className="flex min-h-screen flex-col items-center justify-center bg-charcoal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mobile-frame p-10 flex flex-col justify-between">
              <div>
                <button onClick={() => setCurrentScreen('selection')} className="mb-8 text-white/40 flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                  <RotateCcw size={14} /> Back
                </button>
                <h2 className="mb-2 font-display text-3xl font-bold text-white uppercase tracking-widest">Settings</h2>
                <p className="mb-12 text-neon-cyan font-bold uppercase tracking-widest text-xs">for {selectedGame?.toUpperCase()}</p>
                
                <div className="space-y-10">
                  <div className="space-y-4">
                    <span className="text-xs uppercase font-bold text-white/40 tracking-[0.2em]">Difficulty Level</span>
                    <div className="flex gap-3">
                      {(['easy', 'medium', 'hard'] as const).map(d => (
                        <button 
                          key={d} 
                          onClick={() => setDifficulty(d)}
                          className={`flex-1 py-4 rounded-2xl font-bold uppercase text-xs transition-all ${difficulty === d ? 'skeuo-button neon-cyan-glow' : 'skeuo-button text-white/20'}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <span className="text-xs uppercase font-bold text-white/40 tracking-[0.2em]">Game Mode</span>
                    <div className="flex gap-3">
                      {(['ai', 'multiplayer'] as const).map(m => (
                        <button 
                          key={m} 
                          onClick={() => setMode(m)}
                          className={`flex-1 py-4 rounded-2xl font-bold uppercase text-xs transition-all ${mode === m ? 'skeuo-button neon-purple-glow' : 'skeuo-button text-white/20'}`}
                        >
                          {m === 'ai' ? 'Solo' : 'Multi'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-xs uppercase font-bold text-white/40 tracking-[0.2em]">How to Play</span>
                    <div className="skeuo-card p-5 rounded-2xl">
                      <p className="text-xs text-white/60 leading-relaxed italic">
                        {selectedGame ? howToPlay[selectedGame] : "Select a game to see instructions."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setCurrentScreen('game')}
                className="skeuo-button neon-cyan-glow w-full py-6 rounded-3xl font-display font-bold text-xl uppercase tracking-widest flex items-center justify-center gap-4"
              >
                START GAME <ChevronRight />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="game" 
            className="flex min-h-screen flex-col items-center justify-center bg-charcoal"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="mobile-frame p-4 flex flex-col bg-[#050505]">
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {renderGame()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
