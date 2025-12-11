import React from 'react';
import type { GridMatrix, ColorDefinition } from '../types';

interface BoardProps {
  grid: GridMatrix;
  colors: ColorDefinition[];
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

export const Board: React.FC<BoardProps> = ({ grid, colors, onMouseDown, onMouseEnter, onMouseUp }) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const cellSize = `max(10px, 95vmin / ${Math.max(rows, cols)})`;
  const fontSize = `calc(${cellSize} * 0.45)`;

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.05)',
      margin: '0 auto',
    }}>
    <div
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cellSize})`,
        gap: '1px',
        backgroundColor: '#e0e0e0',
        border: '1px solid #ccc',
        userSelect: 'none',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        margin: '0 auto' 
      }}
    >
      {grid.map((row) =>
        row.map((cell) => {
            const activeColorId = cell.filledColorId; 
            const activeColorDef = colors.find(c => c.id === activeColorId);
            const bgColor = activeColorDef ? activeColorDef.hex : '#fff';
            const isCorrect = cell.filledColorId === cell.targetColorId;
            const isFilled = cell.filledColorId !== null;
            let opacity = '1';       
            let textColor = '#ddd';  
            if (isFilled) {
                if (isCorrect) {
                    opacity = '1'; 
                    textColor = 'transparent'; 
                } else {
                    opacity = '0.5';
                    const isDarkColor = activeColorDef?.hex === '#000000' || activeColorDef?.hex === '#0077be';
                    textColor = isDarkColor ? '#fff' : '#000'; 
                }
            }

          return (
            <div
              key={`${cell.row}-${cell.col}-${cell.filledColorId}`}
              onMouseDown={() => onMouseDown(cell.row, cell.col)}
              onMouseEnter={() => onMouseEnter(cell.row, cell.col)}
              className={isFilled ? 'painted-cell' : ''}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: bgColor,
                opacity: opacity,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: fontSize,
                fontWeight: 'bold',
                color: textColor,
                cursor: 'pointer',
                userSelect: 'none',

                zIndex: isFilled ? 1 : 0
              }}
            >
              {!isCorrect && cell.targetColorId}
            </div>
          );
        })
      )}
    </div>
    </div>
  );
};