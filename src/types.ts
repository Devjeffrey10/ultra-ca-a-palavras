
export type Theme = {
  id: string;
  name: string;
  description: string;
  words: string[];
  gridSize: number;
};

export type Point = {
  x: number;
  y: number;
};

export type FoundWord = {
  word: string;
  points: Point[];
};

export type GameState = {
  score: number;
  foundWords: string[];
  isComplete: boolean;
  startTime: number | null;
  endTime: number | null;
};
