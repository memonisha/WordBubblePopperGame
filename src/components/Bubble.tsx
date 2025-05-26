'use client';

import React from 'react';

type BubbleProps = {
  id: string;
  char: string;
  x: number;
  y: number;
  onClick: () => void;
};

export default function Bubble({ char, x, y, onClick }: BubbleProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 60,
        height: 60,
        borderRadius: '50%',
        backgroundColor: '#f472b6', // Tailwind pink-400
        color: 'white',
        fontWeight: 'bold',
        fontSize: '2rem',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      aria-label={`Pop letter ${char}`}
    >
      {char}
    </button>
  );
}
