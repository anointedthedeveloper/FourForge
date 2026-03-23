'use client';

export default function Cell({ player, isWin, colIndex, onHover, onClick }) {
  return (
    <td
      className={`cell ${player ? `player-${player}` : ''} ${isWin ? 'win' : ''}`}
      onMouseEnter={() => onHover(colIndex)}
      onClick={() => onClick(colIndex)}
    />
  );
}
