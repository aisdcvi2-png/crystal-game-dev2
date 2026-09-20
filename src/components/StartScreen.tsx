import { subjects } from '../data/questions';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto" style={{
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    }}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              background: ['#E040FB', '#00BCD4', '#FFD600', '#FF1744', '#76FF03'][i % 5],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative text-center p-8 max-w-3xl">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{
            background: 'linear-gradient(to right, #E040FB, #00BCD4, #FFD600)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ⛏️ Кристальный Шахтёр
          </h1>
          <p className="text-xl text-gray-300">
            3D приключение для учеников 2 класса
          </p>
        </div>

        {/* Crystal and pickaxe animation */}
        <div className="text-6xl mb-6 flex items-center justify-center gap-4">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>💎</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>⛏️</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>💎</span>
          <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🪨</span>
          <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>💎</span>
        </div>

        {/* Description */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 mb-6">
          <p className="text-gray-200 text-lg leading-relaxed mb-4">
            Исследуй тёмную пещеру с <span className="text-cyan-400 font-bold">алмазной киркой</span>! 
            Находи светящиеся блоки-руды и добывай кристаллы. 
            Чтобы получить кристалл — ответь правильно на вопрос!
          </p>
          
          {/* How to play */}
          <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
            <h3 className="text-yellow-400 font-bold mb-3 text-lg">🎮 Как играть:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              <div className="flex items-start gap-2">
                <span className="text-2xl">⛏️</span>
                <div>
                  <div className="text-white font-bold text-sm">Добывай блоки</div>
                  <div className="text-gray-400 text-xs">Удерживай ЛКМ чтобы разбить блок</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">💎</span>
                <div>
                  <div className="text-white font-bold text-sm">Собирай кристаллы</div>
                  <div className="text-gray-400 text-xs">Из разбитых руд выпадают кристаллы</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">📝</span>
                <div>
                  <div className="text-white font-bold text-sm">Отвечай на вопросы</div>
                  <div className="text-gray-400 text-xs">Правильный ответ = кристалл зачтён</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">🏆</span>
                <div>
                  <div className="text-white font-bold text-sm">Собери все 20!</div>
                  <div className="text-gray-400 text-xs">Ответь на 100 вопросов по 5 предметам</div>
                </div>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="grid grid-cols-5 gap-3 mt-4">
            {subjects.map(s => (
              <div key={s.name} className="bg-gray-700/50 rounded-xl p-3 text-center border border-gray-600/30">
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-xs text-gray-300 font-medium">{s.name}</div>
                <div className="text-xs text-gray-500">20 вопросов</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6 text-gray-300">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">100</div>
            <div className="text-sm">вопросов</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">5</div>
            <div className="text-sm">предметов</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">20</div>
            <div className="text-sm">кристаллов</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">40</div>
            <div className="text-sm">блоков</div>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white text-2xl font-bold px-12 py-5 rounded-2xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95 transition-all duration-200"
        >
          ⛏️ Начать добычу!
        </button>

        <p className="text-gray-500 text-sm mt-4">
          Нажми на экран для захвата мыши • Удерживай ЛКМ для добычи блоков
        </p>
      </div>
    </div>
  );
}
