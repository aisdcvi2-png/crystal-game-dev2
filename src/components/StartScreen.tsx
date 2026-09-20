interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto" style={{
      background: 'linear-gradient(135deg, #1a472a, #2d5016, #1a3a1a)',
    }}>
      <div className="relative text-center p-6 max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="mb-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-3" style={{
            background: 'linear-gradient(to right, #FFD700, #FFA500, #FF6347)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ⛏️ Кристальный Шахтёр 3D
          </h1>
          <p className="text-lg text-green-200">
            Исследуй мир, собирай кристаллы, активируй портал!
          </p>
        </div>

        <div className="text-5xl mb-4 flex items-center justify-center gap-3">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>⛏️</span>
          <span className="animate-bounce" style={{ animationDelay: '0.15s' }}>💎</span>
          <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🌀</span>
          <span className="animate-bounce" style={{ animationDelay: '0.45s' }}>🏆</span>
        </div>

        <div className="bg-gray-900/70 backdrop-blur-sm border border-green-500/30 rounded-2xl p-5 mb-4">
          <div className="bg-purple-900/30 border border-purple-500/50 rounded-xl p-4 mb-4">
            <h3 className="text-purple-300 font-bold text-lg mb-2">🎯 Конечная цель:</h3>
            <p className="text-gray-200 text-sm">
              Собери <span className="text-purple-400 font-bold">20 кристаллов</span> и <span className="text-yellow-400 font-bold">5 алмазов</span>, 
              скрафти <span className="text-pink-400 font-bold">Ключ Портала</span>, найди портал в углу карты и активируй его!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-2xl">⛏️</div>
              <div className="text-xs text-gray-300">Копай блоки</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-2xl">💎</div>
              <div className="text-xs text-gray-300">Собери кристаллы</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-2xl">🔨</div>
              <div className="text-xs text-gray-300">Крафти ключ</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-2xl">🌀</div>
              <div className="text-xs text-gray-300">Активируй портал</div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
            <h3 className="text-yellow-400 font-bold text-sm mb-2">📚 100 вопросов по 5 предметам:</h3>
            <div className="grid grid-cols-5 gap-2 text-xs">
              <div className="text-center"><div className="text-2xl">🔢</div><div className="text-gray-300">Математика</div></div>
              <div className="text-center"><div className="text-2xl">📝</div><div className="text-gray-300">Русский</div></div>
              <div className="text-center"><div className="text-2xl">🌍</div><div className="text-gray-300">Мир</div></div>
              <div className="text-center"><div className="text-2xl">📚</div><div className="text-gray-300">Чтение</div></div>
              <div className="text-center"><div className="text-2xl">🇬🇧</div><div className="text-gray-300">English</div></div>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white text-xl font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transform hover:scale-105 active:scale-95 transition-all duration-200"
        >
          ⛏️ Начать приключение!
        </button>

        <div className="mt-3 text-gray-400 text-xs">
          Клик для захвата мыши • ЛКМ — копать • ПКМ — ставить • E — инвентарь
        </div>
      </div>
    </div>
  );
}
