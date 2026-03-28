import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Undo2, User, Cpu } from "lucide-react";

type Piece = string;
type Board = Piece[][];
type Position = [number, number];

const INITIAL_BOARD: Board = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

interface ChessProps {
  mode?: 'ai' | 'multiplayer';
  difficulty?: 'easy' | 'medium' | 'hard';
  onHome?: () => void;
}

export default function Chess({ mode: initialMode = 'ai', difficulty = 'medium', onHome }: ChessProps) {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);
  const [selected, setSelected] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [history, setHistory] = useState<Board[]>([]);
  const [mode, setMode] = useState<'ai' | 'multiplayer'>(initialMode);
  const [status, setStatus] = useState<string>('White to move');

  const initGame = useCallback(() => {
    setBoard(INITIAL_BOARD);
    setHistory([]);
    setIsWhiteTurn(true);
    setSelected(null);
    setValidMoves([]);
    setStatus('White to move');
  }, []);

  const isWhite = (piece: string) => {
    if (!piece) return false;
    const code = piece.charCodeAt(0);
    return code >= 9812 && code <= 9817;
  };

  const isBlack = (piece: string) => {
    if (!piece) return false;
    const code = piece.charCodeAt(0);
    return code >= 9818 && code <= 9823;
  };

  const getValidMoves = useCallback((r: number, c: number, currentBoard: Board): Position[] => {
    const piece = currentBoard[r][c];
    if (!piece) return [];
    
    const moves: Position[] = [];
    const white = isWhite(piece);
    const type = piece.toLowerCase();
    
    // Simplified move logic for demo purposes
    // In a real app, this would be much more complex (check, mate, castling, etc.)
    
    const addMove = (nr: number, nc: number) => {
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const target = currentBoard[nr][nc];
        if (!target) {
          moves.push([nr, nc]);
          return true; // can continue sliding
        } else {
          if (white !== isWhite(target)) {
            moves.push([nr, nc]);
          }
          return false; // blocked by piece
        }
      }
      return false;
    };

    if (piece === '♙' || piece === '♟') {
      const dir = white ? -1 : 1;
      // Forward
      if (r + dir >= 0 && r + dir < 8 && !currentBoard[r + dir][c]) {
        moves.push([r + dir, c]);
        // Initial double move
        if ((white && r === 6) || (!white && r === 1)) {
          if (!currentBoard[r + 2 * dir][c]) moves.push([r + 2 * dir, c]);
        }
      }
      // Captures
      for (const dc of [-1, 1]) {
        const nr = r + dir, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = currentBoard[nr][nc];
          if (target && white !== isWhite(target)) moves.push([nr, nc]);
        }
      }
    } else if (piece === '♘' || piece === '♞') {
      const jumps: Position[] = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
      for (const [dr, dc] of jumps) addMove(r + dr, c + dc);
    } else if (piece === '♗' || piece === '♝' || piece === '♖' || piece === '♜' || piece === '♕' || piece === '♛') {
      const dirs: Position[] = [];
      if (piece === '♗' || piece === '♝' || piece === '♕' || piece === '♛') dirs.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
      if (piece === '♖' || piece === '♜' || piece === '♕' || piece === '♛') dirs.push([0, 1], [0, -1], [1, 0], [-1, 0]);
      
      for (const [dr, dc] of dirs) {
        let nr = r + dr, nc = c + dc;
        while (addMove(nr, nc)) {
          nr += dr;
          nc += dc;
        }
      }
    } else if (piece === '♔' || piece === '♚') {
      const dirs: Position[] = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      for (const [dr, dc] of dirs) addMove(r + dr, c + dc);
    }

    return moves;
  }, []);

  const aiMove = useCallback(() => {
    const moves: { from: Position; to: Position; score: number }[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (isBlack(piece)) {
          const vm = getValidMoves(r, c, board);
          for (const m of vm) {
            // Simple scoring: prefer captures
            let score = 0;
            const target = board[m[0]][m[1]];
            if (target) score = 10;
            moves.push({ from: [r, c], to: m, score });
          }
        }
      }
    }
    
    if (moves.length === 0) {
      setStatus('Checkmate! White wins.');
      return;
    }
    
    // Sort by score and pick best or random from best
    moves.sort((a, b) => b.score - a.score);
    const bestScore = moves[0].score;
    const bestMoves = moves.filter(m => m.score === bestScore);
    const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    
    const [fr, fc] = move.from;
    const [nr, nc] = move.to;
    const newBoard = board.map(row => [...row]);
    newBoard[nr][nc] = newBoard[fr][fc];
    newBoard[fr][fc] = '';
    
    setBoard(newBoard);
    setIsWhiteTurn(true);
    setStatus('White to move');
  }, [board, getValidMoves]);

  useEffect(() => {
    if (!isWhiteTurn && mode === 'ai' && !status.includes('wins')) {
      const timer = setTimeout(aiMove, 1000);
      return () => clearTimeout(timer);
    }
  }, [isWhiteTurn, mode, aiMove, status]);

  const selectPiece = (r: number, c: number) => {
    const piece = board[r][c];
    if (!piece) return;
    
    const white = isWhite(piece);
    if (white !== isWhiteTurn) return;
    
    setSelected([r, c]);
    setValidMoves(getValidMoves(r, c, board));
  };

  const movePiece = (nr: number, nc: number) => {
    if (!selected || !validMoves.some(m => m[0] === nr && m[1] === nc)) return;
    
    const [fr, fc] = selected;
    const newBoard = board.map(row => [...row]);
    
    setHistory([...history, board.map(row => [...row])]);
    
    newBoard[nr][nc] = newBoard[fr][fc];
    newBoard[fr][fc] = '';
    
    setBoard(newBoard);
    setSelected(null);
    setValidMoves([]);
    setIsWhiteTurn(!isWhiteTurn);
    setStatus(!isWhiteTurn ? 'White to move' : 'Black to move');
  };

  const undo = () => {
    if (history.length > 0) {
      setBoard(history[history.length - 1]);
      setHistory(history.slice(0, -1));
      setIsWhiteTurn(true);
      setSelected(null);
      setValidMoves([]);
      setStatus('White to move');
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8" id="chess-game">
      <div className="flex w-full max-w-2xl justify-between gap-4 z-10">
        <div className={`flex flex-1 flex-col items-center rounded-2xl p-4 transition-all duration-500 skeuo-card ${isWhiteTurn ? 'ring-2 ring-neon-cyan neon-cyan-glow scale-105' : 'opacity-40'}`}>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">White (You)</span>
          <span className="text-2xl font-bold text-white">Turn</span>
        </div>
        <div className={`flex flex-1 flex-col items-center rounded-2xl p-4 transition-all duration-500 skeuo-card ${!isWhiteTurn ? 'ring-2 ring-neon-purple neon-purple-glow scale-105' : 'opacity-40'}`}>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">{mode === 'ai' ? 'Black (AI)' : 'Black'}</span>
          <span className="text-2xl font-bold text-white">Turn</span>
        </div>
      </div>

      <div className="relative p-4 skeuo-card rounded-[2rem] shadow-2xl overflow-hidden border border-white/5" id="chess-board">
        <div className="grid grid-cols-8 gap-1 bg-black/40 p-2 rounded-xl overflow-hidden">
          {board.flatMap((row, r) =>
            row.map((cell, c) => {
              const isDark = (r + c) % 2 === 1;
              const isValid = validMoves.some(m => m[0] === r && m[1] === c);
              const isSelected = selected && selected[0] === r && selected[1] === c;
              
              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => cell ? selectPiece(r, c) : movePiece(r, c)}
                  className={`relative flex aspect-square w-9 items-center justify-center sm:w-14 transition-all duration-300 rounded-sm ${
                    isDark ? 'bg-white/5' : 'bg-white/10'
                  } ${isValid ? 'after:absolute after:h-3 after:w-3 after:rounded-full after:bg-neon-cyan/60 after:animate-pulse' : ''} ${
                    isSelected ? 'bg-neon-cyan/20 ring-1 ring-neon-cyan/50' : ''
                  }`}
                >
                  <AnimatePresence>
                    {cell && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0, y: -10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0, opacity: 0, y: 10 }}
                        layoutId={`chess-piece-${r}-${c}`}
                        className={`relative z-10 cursor-move text-3xl sm:text-4xl ${
                          isWhite(cell) 
                            ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' 
                            : 'text-neon-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                        }`}
                      >
                        {cell}
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
        <div className="skeuo-card px-8 py-3 font-medium text-lg text-white rounded-full shadow-lg border border-white/5" id="chess-status">
          {status}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {onHome && (
            <button
              onClick={onHome}
              className="skeuo-button px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 text-sm"
              id="chess-home"
            >
              <RotateCcw className="rotate-45" size={18} /> Home
            </button>
          )}
          <button
            onClick={undo}
            className="skeuo-button px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 text-sm"
            id="chess-undo"
          >
            <Undo2 size={18} /> Undo
          </button>
          <button
            onClick={initGame}
            className="skeuo-button neon-cyan-glow px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 text-sm shadow-lg"
            id="chess-restart"
          >
            <RotateCcw size={18} /> New Game
          </button>
        </div>
      </div>
    </div>
  );
}
