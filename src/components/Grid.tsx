import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Point, FoundWord } from '../types';
import { arePointsCollinear, getWordFromPoints } from '../utils/gameLogic';

interface GridProps {
  grid: string[][];
  foundWords: FoundWord[];
  onWordSelection: (word: string, points: Point[]) => boolean;
}

export default function Grid({ grid, foundWords, onWordSelection }: GridProps) {
  const [selection, setSelection] = useState<Point[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const isPointSelected = (x: number, y: number) => {
    return selection.some(p => p.x === x && p.y === y);
  };

  const isPointFound = (x: number, y: number) => {
    return foundWords.some(fw => fw.points.some(p => p.x === x && p.y === y));
  };

  const handleMouseDown = (x: number, y: number) => {
    setIsSelecting(true);
    setSelection([{ x, y }]);
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (!isSelecting) return;

    const newSelection = [...selection, { x, y }];
    
    // Check if new selection is valid (collinear and adjacent)
    if (arePointsCollinear(newSelection)) {
      setSelection(newSelection);
    }
  };

  const stopSelection = () => {
    if (isSelecting && selection.length > 0) {
      const word = getWordFromPoints(grid, selection);
      onWordSelection(word, selection);
    }
    setIsSelecting(false);
    setSelection([]);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => stopSelection();
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [selection, isSelecting]);

  return (
    <div 
      ref={gridRef}
      className="grid gap-1 p-4 cyber-card select-none"
      style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}
    >
      {grid.map((row, y) => (
        row.map((letter, x) => {
          const selected = isPointSelected(x, y);
          const found = isPointFound(x, y);
          
          return (
            <motion.div
              key={`${x}-${y}`}
              id={`cell-${x}-${y}`}
              initial={false}
              animate={{
                scale: selected ? 1.1 : 1,
                backgroundColor: selected ? 'var(--color-cyber-blue)' : found ? 'var(--color-cyber-green)' : 'transparent',
                color: selected || found ? 'var(--color-cyber-black)' : 'var(--color-text)'
              }}
              onMouseDown={() => handleMouseDown(x, y)}
              onMouseEnter={() => handleMouseEnter(x, y)}
              className={`
                grid-cell
                ${selected ? 'grid-cell-selected' : ''}
                ${found ? 'grid-cell-found' : ''}
                ${!selected && !found ? 'cyber-border' : ''}
              `}
            >
              {letter}
            </motion.div>
          );
        })
      ))}
    </div>
  );
}
