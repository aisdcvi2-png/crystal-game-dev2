interface WinScreenProps {
  crystalsCollected: number;
  correctAnswers: number;
  totalQuestions: number;
  onRestart: () => void;
}

export default function WinScreen({ crystalsCollected, correctAnswers, totalQuestions, onRestart }: WinScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a0033, #4a0080, #1a0033)' }}>
      <div className="text-center p-8 max-w-lg">
        <div className="text-8xl mb-6 animate-bounce">🏆</div>
        <h1 className="text-5xl font-bold text-white mb-4">ПОБЕДА!</h1>
        <p className="text-xl text-purple-200 mb-6">Ты собрал все кристаллы и активировал портал!</p>
        <div className="bg-purple-900/50 rounded-2xl p-6 mb-6">
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
              <div className="text-3xl font-bold text-yellow-400">{totalQuestions}</div>
              <div className="text-sm text-gray-400">Вопросов</div>
            </div>
          </div>
        </div>
        <button onClick={onRestart} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold px-10 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all">
          🔄 Играть снова!
        </button>
      </div>
    </div>
  );
}
