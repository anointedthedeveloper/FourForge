'use client';
import { useState, useEffect, useCallback } from 'react';
import Cell from './Cell';
import { createBoard, dropDisc, checkWin, checkDraw, getBestMove, COLS, ROWS } from '../logic/game';

const STORAGE_KEY = 'fourforge_state';

function loadState() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export default function Board() {
  const [board, setBoard] = useState(createBoard);
  const [current, setCurrent] = useState(1);
  const [winCells, setWinCells] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [hover, setHover] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const saved = loadState();
    if (saved) { setBoard(saved.board); setCurrent(saved.current); }

    const handler = e => { e.preventDefault(); setDeferredPrompt(e); setShowInstall(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (!winCells && !isDraw)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ board, current }));
  }, [board, current, winCells, isDraw]);

  const applyMove = useCallback((b, col, player) => {
    const result = dropDisc(b, col, player);
    if (!result) return null;
    const { board: next, row } = result;
    const win = checkWin(next, row, col, player);
    if (win) { setBoard(next); setWinCells(win); playSound('win'); return 'win'; }
    if (checkDraw(next)) { setBoard(next); setIsDraw(true); return 'draw'; }
    setBoard(next);
    playSound('drop');
    return next;
  }, []);

  const handleDrop = useCallback((col) => {
    if (winCells || isDraw || current !== 1 || aiThinking) return;
    const next = applyMove(board, col, 1);
    if (!next || next === 'win' || next === 'draw') return;
    setCurrent(2);
  }, [board, current, winCells, isDraw, aiThinking, applyMove]);

  // AI move effect
  useEffect(() => {
    if (current !== 2 || winCells || isDraw) return;
    setAiThinking(true);
    const id = setTimeout(() => {
      setBoard(b => {
        const col = getBestMove(b);
        const result = dropDisc(b, col, 2);
        if (!result) { setAiThinking(false); return b; }
        const { board: next, row } = result;
        const win = checkWin(next, row, col, 2);
        if (win) { setWinCells(win); playSound('win'); setAiThinking(false); return next; }
        if (checkDraw(next)) { setIsDraw(true); setAiThinking(false); return next; }
        playSound('drop');
        setCurrent(1);
        setAiThinking(false);
        return next;
      });
    }, 300);
    return () => clearTimeout(id);
  }, [current, winCells, isDraw]);

  const restart = () => {
    setBoard(createBoard()); setCurrent(1);
    setWinCells(null); setIsDraw(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null); setShowInstall(false);
  };

  const winSet = winCells ? new Set(winCells.map(([r,c]) => `${r}-${c}`)) : null;
  const gameOver = winCells || isDraw;

  return (
    <div className="game-wrapper">
      <h1 className="title">FourForge</h1>

      <div className="status">
        {isDraw ? '🤝 It\'s a draw!' :
         winCells ? `🎉 ${current === 1 ? 'You win!' : 'AI wins!'}` :
         aiThinking ? '🤖 AI is thinking…' :
         <><span className={`dot player-${current}`} /> {current === 1 ? 'Your turn' : 'AI\'s turn'}</>}
      </div>

      <div className="board-container" onMouseLeave={() => setHover(null)}>
        {/* Hover indicator row */}
        <div className="hover-row">
          {Array.from({ length: COLS }, (_, c) => (
            <div key={c} className={`hover-cell ${hover === c && !gameOver ? `player-${current}` : ''}`} />
          ))}
        </div>

        <table className="board">
          <tbody>
            {board.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <Cell
                    key={c}
                    player={cell}
                    isWin={winSet?.has(`${r}-${c}`)}
                    colIndex={c}
                    onHover={setHover}
                    onClick={handleDrop}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn restart" onClick={restart}>↺ Restart</button>
      {showInstall && <button className="btn install" onClick={installApp}>📲 Install App</button>}

      <footer>Built by AnointedTheDeveloper</footer>
    </div>
  );
}

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    if (type === 'win') {
      o.frequency.setValueAtTime(523, ctx.currentTime);
      o.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      o.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      o.start(); o.stop(ctx.currentTime + 0.6);
    } else {
      o.frequency.setValueAtTime(300, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0.2, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      o.start(); o.stop(ctx.currentTime + 0.1);
    }
  } catch {}
}
