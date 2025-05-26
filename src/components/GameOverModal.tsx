'use client';

type GameOverModalProps = {
  win: boolean;
  onRestart: () => void;
};

export default function GameOverModal({ win, onRestart }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center shadow-lg">
        <h2 className={`text-4xl font-bold mb-4 ${win ? 'text-green-600' : 'text-red-600'}`}>
          {win ? 'You Won! 🎉' : 'Game Over 😢'}
        </h2>
        <button
          onClick={onRestart}
          className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-semibold text-lg transition"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
