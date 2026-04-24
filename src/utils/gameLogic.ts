import { Point } from '../types';

export function generateGrid(size: number, words: string[]) {
  // Initialize empty grid
  const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
  const placedWords: { word: string; points: Point[] }[] = [];

  // Sort words by length descending to place larger ones first
  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  for (const word of sortedWords) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const direction = getRandomDirection();
      const startX = Math.floor(Math.random() * size);
      const startY = Math.floor(Math.random() * size);

      if (canPlaceWord(grid, word, startX, startY, direction)) {
        const points = placeWord(grid, word, startX, startY, direction);
        placedWords.push({ word, points });
        placed = true;
      }
      attempts++;
    }
  }

  // Fill empty spaces with random uppercase letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (grid[y][x] === '') {
        grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return { grid, placedWords };
}

type Direction = { dx: number; dy: number };

function getRandomDirection(): Direction {
  const directions: Direction[] = [
    { dx: 1, dy: 0 },   // Horizontal
    { dx: 0, dy: 1 },   // Vertical
    { dx: 1, dy: 1 },   // Diagonal Down-Right
    { dx: -1, dy: 1 },  // Diagonal Down-Left
    { dx: 0, dy: -1 },  // Vertical Up
    { dx: -1, dy: 0 },  // Horizontal Left
    { dx: -1, dy: -1 }, // Diagonal Up-Left
    { dx: 1, dy: -1 }   // Diagonal Up-Right
  ];
  return directions[Math.floor(Math.random() * directions.length)];
}

function canPlaceWord(grid: string[][], word: string, startX: number, startY: number, dir: Direction) {
  const size = grid.length;
  for (let i = 0; i < word.length; i++) {
    const x = startX + i * dir.dx;
    const y = startY + i * dir.dy;

    if (x < 0 || x >= size || y < 0 || y >= size) return false;
    if (grid[y][x] !== '' && grid[y][x] !== word[i]) return false;
  }
  return true;
}

function placeWord(grid: string[][], word: string, startX: number, startY: number, dir: Direction) {
  const points: Point[] = [];
  for (let i = 0; i < word.length; i++) {
    const x = startX + i * dir.dx;
    const y = startY + i * dir.dy;
    grid[y][x] = word[i];
    points.push({ x, y });
  }
  return points;
}

export function arePointsCollinear(points: Point[]) {
  if (points.length < 2) return true;
  
  const p1 = points[0];
  const p2 = points[1];
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  // Must be one of the grid directions
  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) return false;

  for (let i = 2; i < points.length; i++) {
    const pPrev = points[i - 1];
    const pCurr = points[i];
    if (pCurr.x - pPrev.x !== dx || pCurr.y - pPrev.y !== dy) return false;
  }
  return true;
}

export function getWordFromPoints(grid: string[][], points: Point[]) {
  return points.map(p => grid[p.y][p.x]).join('');
}
