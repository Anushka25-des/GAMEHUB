import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { RotateCcw, Lightbulb, CheckCircle2, Play, Pause } from "lucide-react";

type Difficulty = 'easy' | 'medium' | 'hard';

interface SudokuProps {
  difficulty?: Difficulty;
  onHome?: () => void;
}

export default function Sudoku({ difficulty: initialDifficulty = 'easy', onHome }: SudokuProps) {
  const [grid, setGrid] = useState<number[][]>(Array(9).fill(null).map(() => Array(9).fill(0)));
  const [original, setOriginal] = useState<number[][]>(Array(9).fill(null).map(() => Array(9).fill(0)));
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'info' | 'error' | null }>({ message: '', type: null });
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);

  const isValid = (grid: number[][], r: number, c: number, num: number) => {
    for (let i = 0; i < 9; i++) {
      if (grid[r][i] === num || grid[i][c] === num) return false;
    }
    const br = r - (r % 3), bc = c - (c % 3);
    for (let i = br; i < br + 3; i++) {
      for (let j = bc; j < bc + 3; j++) {
        if (grid[i][j] === num) return false;
      }
    }
    return true;
  };

  const solveSudoku = useCallback((grid: number[][]): boolean => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, r, c, num)) {
              grid[r][c] = num;
              if (solveSudoku(grid)) return true;
              grid[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }, []);

  const generateSolution = useCallback(() => {
    const grid = Array(9).fill(null).map(() => Array(9).fill(0));
    // Fill diagonal 3x3 boxes
    for (let i = 0; i < 9; i += 3) {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
      let idx = 0;
      for (let j = i; j < i + 3; j++) {
        for (let k = i; k < i + 3; k++) {
          grid[j][k] = nums[idx++];
        }
      }
    }
    solveSudoku(grid);
    return grid;
  }, [solveSudoku]);

  const initGame = useCallback(() => {
    const solution = generateSolution();
    const puzzle = JSON.parse(JSON.stringify(solution));
    const cellsToRemove = difficulty === 'easy' ? 35 : difficulty === 'medium' ? 45 : 55;
    let removed = 0;
    while (removed < cellsToRemove) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (puzzle[r][c] !== 0) {
        puzzle[r][c] = 0;
        removed++;
      }
    }
    setOriginal(JSON.parse(JSON.stringify(puzzle)));
    setGrid(puzzle);
    setStatus({ message: '', type: null });
    setTimer(0);
    setIsPaused(false);
  }, [difficulty, generateSolution]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused && status.type !== 'success') {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, status.type]);

  const handleInputChange = (r: number, c: number, val: string) => {
    if (isPaused) return;
    const num = parseInt(val);
    if (isNaN(num) || num < 1 || num > 9) {
      const newGrid = [...grid];
      newGrid[r][c] = 0;
      setGrid(newGrid);
    } else {
      const newGrid = [...grid];
      newGrid[r][c] = num;
      setGrid(newGrid);
      checkWin(newGrid);
    }
  };

  const checkWin = (currentGrid: number[][]) => {
    let filled = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentGrid[i][j] === 0) filled = false;
      }
    }
    if (filled) {
      // Basic check: rows, cols, boxes
      let valid = true;
      for (let i = 0; i < 9; i++) {
        const row = new Set();
        const col = new Set();
        for (let j = 0; j < 9; j++) {
          if (row.has(currentGrid[i][j]) || col.has(currentGrid[j][i])) valid = false;
          row.add(currentGrid[i][j]);
          col.add(currentGrid[j][i]);
        }
      }
      if (valid) {
        setStatus({ message: '🎉 Congratulations! You solved the puzzle!', type: 'success' });
      } else {
        setStatus({ message: '❌ Something is wrong. Check your numbers!', type: 'error' });
      }
    }
  };

  const getHint = () => {
    if (isPaused) return;
    const solution = JSON.parse(JSON.stringify(grid));
    if (solveSudoku(solution)) {
      const emptyCells = [];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (grid[r][c] === 0) emptyCells.push({ r, c });
        }
      }
      if (emptyCells.length > 0) {
        const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const newGrid = [...grid];
        newGrid[r][c] = solution[r][c];
        setGrid(newGrid);
        checkWin(newGrid);
      }
    }
  };

  const solve = () => {
    if (isPaused) return;
    const solution = JSON.parse(JSON.stringify(grid));
    if (solveSudoku(solution)) {
      setGrid(solution);
      setStatus({ message: '✓ Solved!', type: 'success' });
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8" id="sudoku-game">
      <div className="flex w-full max-w-2xl justify-between gap-4 z-10">
        <div className="flex flex-1 flex-col items-center rounded-2xl p-4 skeuo-card">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Difficulty</span>
          <span className="text-xl font-bold text-neon-cyan neon-cyan-glow uppercase tracking-widest">{difficulty}</span>
        </div>
        <div className="flex flex-1 flex-col items-center rounded-2xl p-4 skeuo-card">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Timer</span>
          <span className="text-xl font-mono font-bold text-neon-purple neon-purple-glow">{formatTime(timer)}</span>
        </div>
      </div>

      <div className="relative p-4 skeuo-card rounded-[2rem] shadow-2xl border border-white/5">
        <div className="grid grid-cols-9 gap-1 bg-black/40 p-2 rounded-xl overflow-hidden" id="sudoku-board">
          {grid.flatMap((row, r) =>
            row.map((val, c) => {
              const isThickRight = c % 3 === 2 && c !== 8;
              const isThickBottom = r % 3 === 2 && r !== 8;
              const isOriginal = original[r][c] !== 0;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`flex aspect-square w-9 items-center justify-center sm:w-12 transition-all duration-300 relative ${
                    isThickRight ? 'mr-1' : ''
                  } ${isThickBottom ? 'mb-1' : ''} ${
                    isOriginal ? 'bg-white/5' : 'bg-white/10 hover:bg-white/20'
                  } rounded-sm`}
                >
                  {isOriginal ? (
                    <span className="text-lg font-bold text-white sm:text-2xl">{val}</span>
                  ) : (
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[1-9]*"
                      value={val === 0 ? '' : val}
                      onChange={(e) => handleInputChange(r, c, e.target.value)}
                      className="h-full w-full bg-transparent text-center text-lg font-bold text-neon-cyan focus:bg-neon-cyan/10 focus:outline-none sm:text-2xl"
                      disabled={isPaused}
                    />
                  )}
                  {/* Grid lines for 3x3 blocks */}
                  {isThickRight && <div className="absolute -right-1 top-0 bottom-0 w-1 bg-neon-purple/30" />}
                  {isThickBottom && <div className="absolute -bottom-1 left-0 right-0 h-1 bg-neon-purple/30" />}
                </div>
              );
            })
          )}
        </div>

        {isPaused && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[2rem] bg-charcoal/80 backdrop-blur-md">
            <h3 className="mb-8 text-3xl font-bold text-white tracking-[0.3em] neon-purple-glow">PAUSED</h3>
            <button
              onClick={() => setIsPaused(false)}
              className="skeuo-button neon-cyan-glow px-10 py-4 rounded-xl text-lg font-bold text-white transition-transform active:scale-95"
              id="sudoku-resume-btn"
            >
              RESUME
            </button>
          </div>
        )}
      </div>

      {status.message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md rounded-xl p-4 skeuo-card border-l-4 ${
            status.type === 'success' ? 'border-neon-cyan' :
            status.type === 'error' ? 'border-neon-pink' :
            'border-neon-purple'
          }`}
          id="sudoku-status"
        >
          <p className="text-white font-medium text-center">{status.message}</p>
        </motion.div>
      )}

      <div className="flex flex-wrap justify-center gap-4 z-10">
        {onHome && (
          <button
            onClick={onHome}
            className="skeuo-button px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 text-sm"
            id="sudoku-home"
          >
            <RotateCcw className="rotate-45" size={18} /> Home
          </button>
        )}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="skeuo-button px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 text-sm"
          id="sudoku-pause-toggle"
        >
          {isPaused ? <Play size={18} /> : <Pause size={18} />}
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={initGame}
          className="skeuo-button px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 text-sm"
          id="sudoku-restart"
        >
          <RotateCcw size={18} /> Restart
        </button>
        <button
          onClick={getHint}
          className="skeuo-button px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 text-sm"
          id="sudoku-hint"
        >
          <Lightbulb size={18} /> Hint
        </button>
        <button
          onClick={solve}
          className="skeuo-button neon-pink-glow px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 text-sm"
          id="sudoku-solve"
        >
          <CheckCircle2 size={18} /> Solve
        </button>
      </div>
    </div>
  );
}
