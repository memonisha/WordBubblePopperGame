'use client';

type WordDisplayProps = {
  word: string;
};

export default function WordDisplay({ word }: WordDisplayProps) {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-yellow-200 via-pink-300 to-purple-300">
      <h2 className="text-6xl font-extrabold text-pink-700 drop-shadow-lg animate-pulse">
        {word}
      </h2>
    </div>
  );
}
