export type BubbleLetter = {
  id: string;
  char: string;
  isCorrect: boolean;
  x: number;
  y: number;
};

export type GameState = 'intro' | 'flash' | 'play' | 'won' | 'lost';
