import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Undo2, User, Cpu } from "lucide-react";

const EMPTY = 0, PLAYER = 1, OPPONENT = 2, PLAYER_KING = 3, OPPONENT_KING = 4;

type Board = number[][];
type Position = [number, number];

interface CheckersProps {
  mode?: 'ai' | 'multiplayer';
  difficulty?: 'easy' | 'medium' | 'hard';
  onHome?: () => void;
}

export default function Checkers({ mode: initialMode = 'ai', difficulty = 'medium', onHome }: CheckersProps) {
  const [board, setBoard] = useState<Board>([]);
  const [selected, setSelected] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [history, setHistory] = useState<Board[]>([]);
  const [mode, setMode] = useState<'ai' | 'multiplayer'>(initialMode);
  const [status, setStatus] = useState<string>('');

  const initGame = useCallback(() => {
    const newBoard = Array(8).fill(null).map(() => Array(8).fill(EMPTY));
    // Player pieces (Black/Dark) at bottom
    for (let r = 5; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) newBoard[r][c] = PLAYER;
      }
    }
    // Opponent pieces (Red/Light) at top
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) newBoard[r][c] = OPPONENT;
      }
    }
    setBoard(newBoard);
    setHistory([]);
    setPlayerTurn(true);
    setSelected(null);
    setValidMoves([]);
    setStatus('Ready to play!');
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const getValidMoves = useCallback((r: number, c: number, currentBoard: Board): Position[] => {
    const piece = currentBoard[r][c];
    const moves: Position[] = [];
    const isPlayer = piece === PLAYER || piece === PLAYER_KING;
    const isKing = piece === PLAYER_KING || piece === OPPONENT_KING;
    
    // Directions: Player moves up (-1), Opponent moves down (+1)
    const dirs: [number, number][] = isKing ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : 
                                    isPlayer ? [[-1, 1], [-1, -1]] : [[1, 1], [1, -1]];
    
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && currentBoard[nr][nc] === EMPTY) {
        moves.push([nr, nc]);
      }
      
      const jr = r + dr * 2, jc = c + dc * 2;
      const mr = r + dr, mc = c + dc;
      if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8 && currentBoard[jr][jc] === EMPTY) {
        const target = currentBoard[mr][mc];
        if (target !== EMPTY) {
          const isTargetPlayer = target === PLAYER || target === PLAYER_KING;
          if (isPlayer !== isTargetPlayer) {
            moves.push([jr, jc]);
          }
        }
      }
    }
    return moves;
  }, []);

  const aiMove = useCallback(() => {
    const moves: { from: Position; to: Position }[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece === OPPONENT || piece === OPPONENT_KING) {
          const vm = getValidMoves(r, c, board);
          for (const m of vm) moves.push({ from: [r, c], to: m });
        }
      }
    }
    
    if (moves.length === 0) {
      setStatus('🎉 You Won! AI has no moves.');
      return;
    }
    
    // Simple AI: Prefer jumps
    const jumps = moves.filter(m => Math.abs(m.to[0] - m.from[0]) === 2);
    const move = jumps.length > 0 ? jumps[Math.floor(Math.random() * jumps.length)] : moves[Math.floor(Math.random() * moves.length)];
    
    const [fr, fc] = move.from;
    const [nr, nc] = move.to;
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[fr][fc];
    
    if (Math.abs(nr - fr) === 2) {
      newBoard[(fr + nr) / 2][(fc + nc) / 2] = EMPTY;
    }
    
    newBoard[nr][nc] = piece;
    newBoard[fr][fc] = EMPTY;
    
    if (piece === OPPONENT && nr === 7) {
      newBoard[nr][nc] = OPPONENT_KING;
    }
    
    setBoard(newBoard);
    setPlayerTurn(true);
  }, [board, getValidMoves]);

  useEffect(() => {
    if (!playerTurn && mode === 'ai' && !status.includes('Won')) {
      const timer = setTimeout(aiMove, 800);
      return () => clearTimeout(timer);
    }
  }, [playerTurn, mode, aiMove, status]);

  const selectPiece = (r: number, c: number) => {
    if (!playerTurn && mode === 'ai') return;
    const piece = board[r][c];
    if (piece === EMPTY) return;
    
    const isWhiteTurn = playerTurn;
    const isPieceWhite = piece === PLAYER || piece === PLAYER_KING;
    
    if (mode === 'multiplayer') {
      if (isWhiteTurn !== isPieceWhite) return;
    } else {
      if (!isPieceWhite) return;
    }
    
    setSelected([r, c]);
    setValidMoves(getValidMoves(r, c, board));
  };

  const movePiece = (nr: number, nc: number) => {
    if (!selected || !validMoves.some(m => m[0] === nr && m[1] === nc)) return;
    
    const [fr, fc] = selected;
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[fr][fc];
    
    setHistory([...history, board.map(row => [...row])]);
    
    if (Math.abs(nr - fr) === 2) {
      newBoard[(fr + nr) / 2][(fc + nc) / 2] = EMPTY;
    }
    
    newBoard[nr][nc] = piece;
    newBoard[fr][fc] = EMPTY;
    
    if (piece === PLAYER && nr === 0) {
      newBoard[nr][nc] = PLAYER_KING;
    } else if (piece === OPPONENT && nr === 7) {
      newBoard[nr][nc] = OPPONENT_KING;
    }
    
    setBoard(newBoard);
    setSelected(null);
    setValidMoves([]);
    setPlayerTurn(!playerTurn);
    
    // Check win condition
    let pCount = 0, oCount = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (newBoard[r][c] === PLAYER || newBoard[r][c] === PLAYER_KING) pCount++;
        if (newBoard[r][c] === OPPONENT || newBoard[r][c] === OPPONENT_KING) oCount++;
      }
    }
    if (pCount === 0) setStatus('🔴 Red Wins!');
    if (oCount === 0) setStatus('⚫ Black Wins!');
  };

  const undo = () => {
    if (history.length > 0) {
      setBoard(history[history.length - 1]);
      setHistory(history.slice(0, -1));
      setPlayerTurn(true);
      setSelected(null);
      setValidMoves([]);
      setStatus('Undo successful');
    }
  };

  const getPieceCounts = () => {
    let p = 0, o = 0;
    board.forEach(row => row.forEach(cell => {
      if (cell === PLAYER || cell === PLAYER_KING) p++;
      if (cell === OPPONENT || cell === OPPONENT_KING) o++;
    }));
    return { p, o };
  };

  const { p, o } = getPieceCounts();

  return (
    <div className="flex flex-col items-center gap-8 py-8" id="checkers-game">
      <div className="flex w-full max-w-2xl justify-between gap-4 z-10">
        <div className={`flex flex-1 flex-col items-center rounded-2xl p-4 transition-all duration-500 skeuo-card ${playerTurn ? 'ring-2 ring-neon-cyan neon-cyan-glow scale-105' : 'opacity-40'}`}>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Black (You)</span>
          <span className="text-3xl font-bold text-white">{p}</span>
        </div>
        <div className={`flex flex-1 flex-col items-center rounded-2xl p-4 transition-all duration-500 skeuo-card ${!playerTurn ? 'ring-2 ring-neon-pink neon-pink-glow scale-105' : 'opacity-40'}`}>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">{mode === 'ai' ? 'AI (Red)' : 'Red'}</span>
          <span className="text-3xl font-bold text-white">{o}</span>
        </div>
      </div>

      <div className="relative p-4 skeuo-card rounded-[2rem] shadow-2xl overflow-hidden border border-white/5" id="checkers-board">
        <div className="grid grid-cols-8 gap-1 bg-black/40 p-2 rounded-xl overflow-hidden">
          {board.flatMap((row, r) =>
            row.map((cell, c) => {
              const isDark = (r + c) % 2 === 1;
              const isValid = validMoves.some(m => m[0] === r && m[1] === c);
              const isSelected = selected && selected[0] === r && selected[1] === c;
              
              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => isDark && (cell !== EMPTY ? selectPiece(r, c) : movePiece(r, c))}
                  className={`relative flex aspect-square w-9 items-center justify-center sm:w-14 transition-all duration-300 rounded-sm ${
                    isDark ? 'bg-white/5' : 'bg-white/10'
                  } ${isValid ? 'after:absolute after:h-3 after:w-3 after:rounded-full after:bg-neon-cyan/60 after:animate-pulse' : ''} ${
                    isSelected ? 'bg-neon-cyan/20 ring-1 ring-neon-cyan/50' : ''
                  }`}
                >
                  <AnimatePresence>
                    {cell !== EMPTY && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0, y: -10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0, opacity: 0, y: 10 }}
                        layoutId={`piece-${r}-${c}`}
                        className={`relative z-10 h-[85%] w-[85%] rounded-full shadow-xl flex items-center justify-center border-2 puffy-3d ${
                          cell === PLAYER || cell === PLAYER_KING 
                            ? 'bg-charcoal border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]' 
                            : 'bg-neon-pink border-neon-pink/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]'
                        }`}
                      >
                        {(cell === PLAYER_KING || cell === OPPONENT_KING) && (
                          <span className="text-lg text-amber-400 sm:text-xl drop-shadow-md">👑</span>
                        )}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 z-10 w-full">
        <div className="skeuo-card px-8 py-3 font-medium text-lg text-white rounded-full shadow-lg border border-white/5" id="checkers-status">
          {status || 'Ready to play!'}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {onHome && (
            <button
              onClick={onHome}
              className="skeuo-button px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 text-sm"
              id="checkers-home"
            >
              <RotateCcw className="rotate-45" size={18} /> Home
            </button>
          )}
          <button
            onClick={undo}
            className="skeuo-button px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 text-sm"
            id="checkers-undo"
          >
            <Undo2 size={18} /> Undo
          </button>
          <button
            onClick={initGame}
            className="skeuo-button neon-cyan-glow px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 text-sm shadow-lg"
            id="checkers-restart"
          >
            <RotateCcw size={18} /> New Game
          </button>
        </div>
      </div>
    </div>
  );
}
