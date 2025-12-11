import { useState, useEffect } from 'react';
import { Palette } from './components/Palette';
import { Board } from './components/Board';
import type { ColorDefinition, GridMatrix } from './types';

const PALETTE: ColorDefinition[] = [
  { id: 0, hex: '#a4b6c0', label: 'Background' },
  { id: 1, hex: '#000000', label: 'Black' },
  { id: 2, hex: '#6f8ca0', label: 'SharkSkin' },
  { id: 3, hex: '#FFFFFF', label: 'White' }, 
  { id: 4, hex: '#b0955a', label: 'Brown' },
  { id: 5, hex: '#f4bab9', label: 'Pink' },
  { id: 6, hex: '#826b3d', label: 'DarkerBrown' }, 
  { id: 7, hex: '#4e3008', label: 'DarkestBrown' }, 
];

const LEVEL_MAP = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 1, 1, 3, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 3, 1, 1, 6, 7, 6, 1, 1, 3, 3, 2, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 6, 7, 4, 4, 4, 7, 6, 1, 3, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 6, 1, 3, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 4, 4, 1, 3, 3, 3, 1, 4, 6, 6, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 6, 3, 3, 3, 5, 3, 3, 3, 3, 1, 3, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 3, 1, 1, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 3, 1, 1, 3, 3, 1, 3, 3, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 2, 3, 3, 3, 1, 1, 3, 3, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 2, 6, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 0, 1, 2, 6, 7, 6, 1, 3, 3, 3, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 1, 1, 4, 4, 4, 1, 3, 3, 1, 3, 6, 4, 7, 4, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 3, 3, 3, 1, 3, 3, 1, 3, 3, 6, 4, 1, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
  [0, 1, 5, 5, 1, 1, 1, 3, 3, 3, 3, 1, 3, 3, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 5, 5, 1, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 3, 3, 1, 3, 3, 3, 3, 3, 3, 1, 5, 3, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 3, 1, 3, 3, 3, 3, 3, 1, 5, 5, 3, 3, 6, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
  [0, 0, 1, 4, 4, 1, 3, 3, 3, 3, 1, 3, 3, 3, 6, 4, 1, 2, 2, 2, 1, 0, 1, 1, 2, 2, 2, 1, 0, 0, 0, 0],
  [0, 0, 1, 7, 6, 1, 2, 2, 2, 3, 1, 3, 3, 4, 4, 4, 1, 2, 2, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 6, 6, 7, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function App() {
  const [grid, setGrid] = useState<GridMatrix>([]);
  const [selectedColor, setSelectedColor] = useState<number>(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const resetGame = () => {
    const rows = LEVEL_MAP.length;
    const cols = LEVEL_MAP[0].length;
    const matrix: GridMatrix = [];

    for (let r = 0; r < rows; r++) {
      const rowData = [];
      for (let c = 0; c < cols; c++) {
        const targetId = LEVEL_MAP[r][c];
        rowData.push({
          row: r,
          col: c,
          targetColorId: targetId,
          filledColorId: null, 
        });
      }
      matrix.push(rowData);
    }
    setGrid(matrix);
    setGameWon(false);
  };

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (grid.length === 0) return;

    const isComplete = grid.every(row => 
      row.every(cell => cell.filledColorId === cell.targetColorId)
    );

    if (isComplete) {
      setGameWon(true);
    }
  }, [grid]);

  const paintCell = (r: number, c: number) => {
    if (gameWon) return;

    const cell = grid[r][c];
    if (cell.filledColorId === cell.targetColorId) return;

    setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        newGrid[r] = [...prevGrid[r]];
        newGrid[r][c] = { ...newGrid[r][c], filledColorId: selectedColor };
        return newGrid;
    });
  };

  const handleMouseDown = (r: number, c: number) => { setIsDrawing(true); paintCell(r, c); };
  const handleMouseEnter = (r: number, c: number) => { if (isDrawing) paintCell(r, c); };
  const handleMouseUp = () => { setIsDrawing(false); };

  return (
    <div 
      onMouseUp={handleMouseUp}
      style={{ 
        minHeight: '100vh', 
        width: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        padding: '40px 20px', 
        boxSizing: 'border-box'
      }}
    >
      <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>
        <span className="sea-title">Color by Number! What will it be</span> 🤔
      </h1>
      
      <div style={{ marginBottom: '10px' }}>
        <Palette colors={PALETTE} selectedColorId={selectedColor} onSelect={setSelectedColor} />
      </div>
      
      {grid.length > 0 && (
        <Board 
          grid={grid} colors={PALETTE} 
          onMouseDown={handleMouseDown} onMouseEnter={handleMouseEnter} onMouseUp={handleMouseUp}
        />
      )}
      {gameWon && (
        <div style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.5s ease'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
          }}>
            <h1 style={{ fontSize: '40px', color: '#333', margin: '0 0 20px 0' }}>You did it! Happy birthday!! </h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
              🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳
            </p>
            
            <button 
              onClick={() => setGameWon(false)} 
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '10px 30px',
                fontSize: '16px',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 0 #218838',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;