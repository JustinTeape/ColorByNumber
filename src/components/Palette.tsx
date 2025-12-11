import React from 'react';
import type { ColorDefinition } from '../types';

interface PaletteProps {
  colors: ColorDefinition[];
  selectedColorId: number;
  onSelect: (id: number) => void;
}

export const Palette: React.FC<PaletteProps> = ({ colors, selectedColorId, onSelect }) => {
  return (
    <div style={{ display: 'flex', gap: '10px', padding: '20px', justifyContent: 'center' }}>
      {colors.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className="palette-btn"
          style={{
            backgroundColor: c.hex,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: selectedColorId === c.id ? '4px solid #333' : '2px solid #ccc',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            textShadow: '0px 0px 3px #000'
          }}
        >
          {c.id}
        </button>
      ))}
    </div>
  );
};