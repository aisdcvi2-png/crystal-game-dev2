interface WinScreenProps {
  crystalsCollected: number;
  correctAnswers: number;
  totalQuestions: number;
  onRestart: () => void;
}

export default function WinScreen({ crystalsCollected, correctAnswers, totalQuestions, onRestart }: WinScreenProps) {
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  
  let grade = '🌟';
  let message = '';
  if (accuracy >= 90) {
    grade = '🏆';
    message = 'Превосходно! Ты настоящий гений!';
  } else if (accuracy >= 70) {
    grade = '🌟';
    message = 'Отлично! Ты очень умный!';
  } else if (accuracy >= 50) {
    grade = '⭐';
    message = 'Хорошо! Продолжай учиться!';
  } else {
    grade = '📚';
    message = 'Не сдавайся! Попробуй ещё раз!';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    }}>
      {/* Confetti effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          >
            {['💎', '✨', '🌟', '⭐', '🎉'][i % 5]}
          </div>
        ))}
      </div>

      <div className="relative text-center p-8 max-w-lg">
        <div className="text-8xl mb-6">{grade}</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Поздравляем! 🎉
        </h1>
        <p className="text-xl text-gray-300 mb-8">{message}</p>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{crystalsCollected}</div>
              <div className="text-sm text-gray-400">Кристаллов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{correctAnswers}</div>
              <div className="text-sm text-gray-400">Правильных</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{accuracy}%</div>
              <div className="text-sm text-gray-400">Точность</div>
            </div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white text-xl font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95 transition-all duration-200"
        >
          🔄 Играть снова!
        </button>
      </div>
    </div>
  );
}
