'use client';

import { useEffect, useState, useRef } from 'react';
import WordDisplay from '@/components/WordDisplay';
import GameOverModal from '@/components/GameOverModal';
import Bubble from '@/components/Bubble';
import { words } from '@/lib/words';
import { BubbleLetter, GameState } from '@/types';
import { v4 as uuid } from 'uuid';

type MovingBubble = BubbleLetter & {
  vx: number;
  vy: number;
};

export default function HomePage() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentWord, setCurrentWord] = useState('');
  const [bubbles, setBubbles] = useState<MovingBubble[]>([]);
const [poppedLetters, setPoppedLetters] = useState<string[]>([]);
  const animationFrameRef = useRef<number>();

  const popSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    popSound.current = new Audio('/sounds/pop.mp3');
    wrongSound.current = new Audio('/sounds/wrong.mp3');
  }, []);

  const startNewRound = () => {
    const word = words[Math.floor(Math.random() * words.length)].toUpperCase();
    setCurrentWord(word);
    setPoppedLetters([]);
    setGameState('flash');
  };

  useEffect(() => {
    if (gameState !== 'flash') return;

    const timeout = setTimeout(() => {
      generateBubbles(currentWord);
      setGameState('play');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [gameState, currentWord]);

  // Generate bubbles randomly scattered with random slow velocities
  const generateBubbles = (word: string) => {
    const uniqueLetters = Array.from(new Set(word.split('')));
    const bubbles: MovingBubble[] = [];

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const bubbleSize = 60;

    // Create correct letter bubbles
    uniqueLetters.forEach((char) => {
      bubbles.push({
        id: uuid(),
        char,
        isCorrect: true,
        x: Math.random() * (screenWidth - bubbleSize),
        y: Math.random() * (screenHeight - bubbleSize),
        vx: (Math.random() * 0.3 + 0.1) * (Math.random() < 0.5 ? -1 : 1),
        vy: (Math.random() * 0.3 + 0.1) * (Math.random() < 0.5 ? -1 : 1),
      });
    });

    // Distractor letters
    const distractorCount = 10;
    const distractorSet = new Set(uniqueLetters);
    for (let i = 0; i < distractorCount; i++) {
      let letter = '';
      do {
        letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      } while (distractorSet.has(letter));
      distractorSet.add(letter);
      bubbles.push({
        id: uuid(),
        char: letter,
        isCorrect: false,
        x: Math.random() * (screenWidth - bubbleSize),
        y: Math.random() * (screenHeight - bubbleSize),
        vx: (Math.random() * 0.3 + 0.1) * (Math.random() < 0.5 ? -1 : 1),
        vy: (Math.random() * 0.3 + 0.1) * (Math.random() < 0.5 ? -1 : 1),
      });
    }

    setBubbles(bubbles);
  };

  // Collision detection and bounce
  const handleCollisions = (bubbles: MovingBubble[]) => {
    const size = 60;
    // Bounce off walls
    bubbles.forEach((b) => {
      if (b.x <= 0) b.vx = Math.abs(b.vx);
      if (b.x >= window.innerWidth - size) b.vx = -Math.abs(b.vx);
      if (b.y <= 0) b.vy = Math.abs(b.vy);
      if (b.y >= window.innerHeight - size) b.vy = -Math.abs(b.vy);
    });

    // Bounce off each other
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const b1 = bubbles[i];
        const b2 = bubbles[j];
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < size) {
          // Simple elastic collision: swap velocities
          const tempVx = b1.vx;
          const tempVy = b1.vy;
          b1.vx = b2.vx;
          b1.vy = b2.vy;
          b2.vx = tempVx;
          b2.vy = tempVy;

          // Move bubbles so they don’t stick
          const overlap = size - dist;
          const moveX = (dx / dist) * (overlap / 2);
          const moveY = (dy / dist) * (overlap / 2);
          b1.x -= moveX;
          b1.y -= moveY;
          b2.x += moveX;
          b2.y += moveY;
        }
      }
    }
  };

  // Animation loop
  useEffect(() => {
    if (gameState !== 'play') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = () => {
      setBubbles((prev) => {
        const newBubbles = prev.map((b) => ({
          ...b,
          x: b.x + b.vx,
          y: b.y + b.vy,
        }));

        handleCollisions(newBubbles);

        return newBubbles;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState]);

  const handlePop = (bubble: MovingBubble) => {
    if (bubble.isCorrect) {
      popSound.current?.play();

      setPoppedLetters((prev) => {
        const newPopped = [...prev, bubble.char];
        const uniquePopped = Array.from(new Set(newPopped));
        if (uniquePopped.length === Array.from(new Set(currentWord.split(''))).length) {
          setGameState('won');
        }
        return newPopped;
      });

      setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
    } else {
      wrongSound.current?.play();
      setGameState('lost');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 to-pink-300 overflow-hidden select-none">
      {gameState === 'intro' && (
       <div className="flex flex-col items-center justify-center h-screen text-center px-4">
    {/* Your GIF */}
   
    <img
      src="animated-bubbles.gif"
      alt="Bubbles Animation"
      className="w-80 h-50 mb-6 animate-bounce"
      style={{ animationTimingFunction: 'ease-in-out' }}
    />
 

    <h1 className="text-5xl font-extrabold text-pink-600 mb-6 animate-pulse float-up-down"  style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif', textAlign: 'center', marginTop:-50}}>
      Word Bubble Popper 🎈
    </h1>

    <button
      onClick={startNewRound}
      className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full text-xl font-bold transition float-up-down"
    >
      Start Game
    </button>

    {/* How to play text below the button */}
    <p className="mt-6 max-w-md text-lg text-pink-700 font-semibold px-4 float-up-down" style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif', textAlign: 'center' }}>
      How to play: Watch the word flash on screen, then pop only the bubbles with letters in that word. Pop a wrong letter and it’s game over!
    </p>
  </div>
      )}

      {gameState === 'flash' && <WordDisplay word={currentWord} />}

      {gameState === 'play' && (
        <div className="relative h-screen w-screen overflow-hidden">
          {bubbles.map((bubble) => (
            <Bubble
              key={bubble.id}
              id={bubble.id}
              char={bubble.char}
              x={bubble.x}
              y={bubble.y}
              onClick={() => handlePop(bubble)}
            />
          ))}
        </div>
      )}

      {(gameState === 'won' || gameState === 'lost') && (
        <GameOverModal win={gameState === 'won'} onRestart={startNewRound} />
      )}
    </div>
  );
}
