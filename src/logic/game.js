export const ROWS = 6;
export const COLS = 7;
export const EMPTY = null;

export function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
}

export function dropDisc(board, col, player) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === EMPTY) {
      const next = board.map(r => [...r]);
      next[row][col] = player;
      return { board: next, row };
    }
  }
  return null;
}

const DIRS = [[0,1],[1,0],[1,1],[1,-1]];

export function checkWin(board, row, col, player) {
  for (const [dr, dc] of DIRS) {
    const cells = [[row, col]];
    for (const sign of [-1, 1]) {
      let r = row + dr * sign, c = col + dc * sign;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        cells.push([r, c]);
        r += dr * sign; c += dc * sign;
      }
    }
    if (cells.length >= 4) return cells;
  }
  return null;
}

export function checkDraw(board) {
  return board[0].every(cell => cell !== EMPTY);
}

export function getValidCols(board) {
  return Array.from({ length: COLS }, (_, c) => c).filter(c => board[0][c] === EMPTY);
}

function scoreWindow(window, player) {
  const opp = player === 2 ? 1 : 2;
  const mine = window.filter(c => c === player).length;
  const empty = window.filter(c => c === EMPTY).length;
  const theirs = window.filter(c => c === opp).length;
  if (mine === 4) return 100;
  if (mine === 3 && empty === 1) return 5;
  if (mine === 2 && empty === 2) return 2;
  if (theirs === 3 && empty === 1) return -4;
  return 0;
}

function scoreBoard(board, player) {
  let score = 0;
  // Center column preference
  const center = board.map(r => r[Math.floor(COLS / 2)]);
  score += center.filter(c => c === player).length * 3;
  // Horizontal
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++)
      score += scoreWindow(board[r].slice(c, c + 4), player);
  // Vertical
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r <= ROWS - 4; r++)
      score += scoreWindow([0,1,2,3].map(i => board[r+i][c]), player);
  // Diagonals
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 0; c <= COLS - 4; c++) {
      score += scoreWindow([0,1,2,3].map(i => board[r+i][c+i]), player);
      score += scoreWindow([0,1,2,3].map(i => board[r+3-i][c+i]), player);
    }
  return score;
}

function isTerminal(board) {
  if (checkDraw(board)) return true;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (board[r][c] !== EMPTY && checkWin(board, r, c, board[r][c])) return true;
  return false;
}

function minimax(board, depth, alpha, beta, maximizing) {
  if (depth === 0 || isTerminal(board)) return { score: scoreBoard(board, 2) };
  const cols = getValidCols(board);
  let best = maximizing ? { score: -Infinity } : { score: Infinity };
  for (const col of cols) {
    const res = dropDisc(board, col, maximizing ? 2 : 1);
    if (!res) continue;
    const { score } = minimax(res.board, depth - 1, alpha, beta, !maximizing);
    if (maximizing ? score > best.score : score < best.score) best = { score, col };
    if (maximizing) alpha = Math.max(alpha, score);
    else beta = Math.min(beta, score);
    if (alpha >= beta) break;
  }
  return best;
}

export function getBestMove(board) {
  const { col } = minimax(board, 5, -Infinity, Infinity, true);
  return col ?? getValidCols(board)[0];
}
