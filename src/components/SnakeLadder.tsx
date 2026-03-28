import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, User, Cpu, Dice5, Home } from "lucide-react";

const SNAKES: Record<number, number> = { 17: 4, 54: 31, 62: 18, 87: 24, 93: 73, 99: 79 };
const LADDERS: Record<number, number> = { 3: 22, 5: 8, 11: 26, 20: 29, 27: 81, 51: 67, 72: 91, 88: 99 };

interface SnakeLadderProps {
  mode?: 'ai' | 'multiplayer';
  difficulty?: 'easy' | 'medium' | 'hard';
  onHome?: () => void;
}

export default function SnakeLadder({ mode: initialMode = 'ai', difficulty = 'medium', onHome }: SnakeLadderProps) {
  const [playerPos, setPlayerPos] = useState(1);
  const [aiPos, setAiPos] = useState(1);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [mode, setMode] = useState<'ai' | 'multiplayer'>(initialMode);
  const [status, setStatus] = useState<string>('Roll the dice to start!');
  const boardRef = useRef<HTMLDivElement>(null);

  const initGame = useCallback(() => {
    setPlayerPos(1);
    setAiPos(1);
    setPlayerTurn(true);
    setIsRolling(false);
    setDiceResult(null);
    setStatus('Roll the dice to start!');
  }, []);

  const getCoords = (pos: number) => {
    const row = 9 - Math.floor((pos - 1) / 10);
    const col = row % 2 === 0 ? 9 - ((pos - 1) % 10) : (pos - 1) % 10;
    return { row, col };
  };

  const rollDice = async () => {
    if (isRolling || (mode === 'ai' && !playerTurn)) return;
    
    setIsRolling(true);
    setStatus('Rolling...');
    
    for (let i = 0; i < 10; i++) {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      await new Promise(r => setTimeout(r, 80));
    }
    
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceResult(roll);
    await new Promise(r => setTimeout(r, 400));
    
    let currentPos = playerTurn ? playerPos : aiPos;
    let newPos = currentPos + roll;
    if (newPos > 100) newPos = 100;
    
    const name = playerTurn ? 'Player 1' : (mode === 'ai' ? 'AI' : 'Player 2');
    setStatus(`${name} rolled a ${roll}!`);
    
    for (let i = currentPos + 1; i <= newPos; i++) {
      if (playerTurn) setPlayerPos(i);
      else setAiPos(i);
      await new Promise(r => setTimeout(r, 100));
    }
    
    if (SNAKES[newPos]) {
      await new Promise(r => setTimeout(r, 500));
      setStatus(`🐍 Oh no! A snake at ${newPos}! Sliding down to ${SNAKES[newPos]}...`);
      if (playerTurn) setPlayerPos(SNAKES[newPos]);
      else setAiPos(SNAKES[newPos]);
      newPos = SNAKES[newPos];
    } else if (LADDERS[newPos]) {
      await new Promise(r => setTimeout(r, 500));
      setStatus(`🪜 Yay! A ladder at ${newPos}! Climbing up to ${LADDERS[newPos]}...`);
      if (playerTurn) setPlayerPos(LADDERS[newPos]);
      else setAiPos(LADDERS[newPos]);
      newPos = LADDERS[newPos];
    }
    
    if (newPos === 100) {
      setStatus(`🎉 ${name} WINS!`);
      setIsRolling(false);
      return;
    }
    
    setIsRolling(false);
    setPlayerTurn(!playerTurn);
  };

  useEffect(() => {
    if (!playerTurn && mode === 'ai' && !status.includes('WINS')) {
      const timer = setTimeout(rollDice, 1500);
      return () => clearTimeout(timer);
    }
  }, [playerTurn, mode, status]);

  const renderBoard = () => {
    const cells = [];
    for (let i = 100; i >= 1; i--) {
      const { row, col } = getCoords(i);
      
      cells.push(
        <motion.div
          key={i}
          whileHover={{ translateZ: 20 }}
          className="relative flex aspect-square items-center justify-center border border-white/5 text-[10px] font-bold sm:text-xs bg-white/5 rounded-sm m-0.5 shadow-inner transition-all duration-300"
          style={{ 
            gridRow: row + 1, 
            gridColumn: col + 1,
            transformStyle: 'preserve-3d'
          }}
        >
          <span className="text-white/10">{i}</span>
          
          <AnimatePresence>
            {playerPos === i && (
              <motion.div
                key="player-token"
                layoutId="player-token"
                className="absolute z-20 h-6 w-6 rounded-full border-2 border-white/50 bg-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.8)] sm:h-8 sm:w-8 puffy-3d"
                initial={{ scale: 0, y: -40, translateZ: 50 }}
                animate={{ scale: 1, y: 0, translateZ: 50 }}
                style={{ transformStyle: 'preserve-3d' }}
              />
            )}
            {aiPos === i && (
              <motion.div
                key="ai-token"
                layoutId="ai-token"
                className="absolute z-10 h-6 w-6 rounded-full border-2 border-white/50 bg-neon-pink shadow-[0_0_15px_rgba(255,0,255,0.8)] sm:h-8 sm:w-8 puffy-3d"
                initial={{ scale: 0, y: -40, translateZ: 40 }}
                animate={{ scale: 1, y: 0, translateZ: 40 }}
                style={{ transformStyle: 'preserve-3d' }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      );
    }
    return cells;
  };

  return (
    <div className="flex flex-col items-center gap-8 py-4 bg-charcoal min-h-full">
      <div className="flex w-full max-w-xl justify-between gap-4 px-4">
        <div className={`flex flex-1 flex-col items-center rounded-2xl p-4 transition-all duration-500 skeuo-card ${playerTurn ? 'neon-cyan-glow scale-105' : 'opacity-40'}`}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Player 1</span>
          <span className="text-3xl font-display font-bold text-white">{playerPos}</span>
        </div>
        <div className={`flex flex-1 flex-col items-center rounded-2xl p-4 transition-all duration-500 skeuo-card ${!playerTurn ? 'neon-pink-glow scale-105' : 'opacity-40'}`}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{mode === 'ai' ? 'AI' : 'Player 2'}</span>
          <span className="text-3xl font-display font-bold text-white">{aiPos}</span>
        </div>
      </div>

      <div className="relative w-full max-w-xl p-4 perspective-[2000px]">
        <motion.div 
          initial={{ rotateX: 20, y: 50 }}
          animate={{ rotateX: 25, y: 0 }}
          className="relative w-full aspect-square overflow-hidden rounded-[2.5rem] border-4 border-white/10 bg-[#050505] shadow-[0_50px_100px_rgba(0,0,0,0.8)] p-2" 
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="grid grid-cols-10 grid-rows-10 relative z-10 h-full w-full">
            {renderBoard()}
          </div>
          
          <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ transform: 'translateZ(10px)' }}>
            {/* Ladders */}
            {Object.entries(LADDERS).map(([start, end]) => {
              const s = getCoords(parseInt(start));
              const e = getCoords(end);
              const x1 = s.col * 10 + 5;
              const y1 = s.row * 10 + 5;
              const x2 = e.col * 10 + 5;
              const y2 = e.row * 10 + 5;
              
              return (
                <g key={`ladder-${start}`} className="opacity-40">
                  <line x1={x1-2} y1={y1} x2={x2-2} y2={y2} stroke="white" strokeWidth="0.8" />
                  <line x1={x1+2} y1={y1} x2={x2+2} y2={y2} stroke="white" strokeWidth="0.8" />
                  {[0.2, 0.4, 0.6, 0.8].map((t, i) => (
                    <line 
                      key={i} 
                      x1={(x1-2) + (x2-x1)*t} y1={y1 + (y2-y1)*t} 
                      x2={(x1+2) + (x2-x1)*t} y2={y1 + (y2-y1)*t} 
                      stroke="white" strokeWidth="0.5" 
                    />
                  ))}
                </g>
              );
            })}

            {/* Neon Snakes */}
            {Object.entries(SNAKES).map(([start, end]) => {
              const s = getCoords(parseInt(start));
              const e = getCoords(end);
              const x1 = s.col * 10 + 5;
              const y1 = s.row * 10 + 5;
              const x2 = e.col * 10 + 5;
              const y2 = e.row * 10 + 5;
              
              const midX = (x1 + x2) / 2 + (parseInt(start) % 2 === 0 ? 10 : -10);
              const midY = (y1 + y2) / 2;
              const path = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
              
              return (
                <path 
                  key={`snake-${start}`} 
                  d={path} 
                  fill="none" 
                  stroke="#9d00ff" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  className="drop-shadow-[0_0_8px_rgba(157,0,255,0.8)] animate-pulse"
                />
              );
            })}
          </svg>
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md px-4">
        <div className="flex items-center gap-6 skeuo-card p-6 rounded-3xl w-full justify-center">
          <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 text-4xl font-black text-neon-cyan shadow-inner border border-white/10 ${isRolling ? 'animate-bounce' : ''}`}>
            {diceResult || '?'}
          </div>
          <button
            onClick={rollDice}
            disabled={isRolling || (mode === 'ai' && !playerTurn)}
            className="skeuo-button neon-cyan-glow px-12 py-5 text-xl font-black rounded-2xl disabled:opacity-50"
          >
            ROLL
          </button>
        </div>
        
        <div className="skeuo-card px-8 py-3 font-bold text-white/60 rounded-full text-xs uppercase tracking-widest text-center">
          {status}
        </div>

        <div className="flex gap-4 w-full">
          <button
            onClick={onHome}
            className="flex-1 skeuo-button py-4 font-bold text-white/40 rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
          >
            <Home size={16} /> Home
          </button>
          <button
            onClick={initGame}
            className="flex-1 skeuo-button py-4 font-bold text-white/40 rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
          >
            <RotateCcw size={16} /> Restart
          </button>
        </div>
      </div>
    </div>
  );
}
