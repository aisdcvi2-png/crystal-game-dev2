import { subjects } from '../data/questions';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto" style={{
      background: 'linear-gradient(135deg, #1a472a, #2d5016, #1a3a1a)',
    }}>
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              background: ['#5a9e3a', '#8B6914', '#7f7f7f', '#4a4a4a'][i % 4],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              borderRadius: '2px',
            }}
          />
        ))}
      </div>

      <div className="relative text-center p-6 max-w-3xl">
        <div className="mb-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-3" style={{
            background: 'linear-gradient(to right, #FFD700, #FFA500, #FF6347)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ⛏️ Кристальный Шахтёр 3D
          </h1>
          <p className="text-lg text-green-200">
            Копай, собирай, стройся и учись!
          </p>
        </div>

        <div className="text-5xl mb-4 flex items-center justify-center gap-3">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>⛏️</span>
          <span className="animate-bounce" style={{ animationDelay: '0.15s' }}>🪨</span>
          <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>💎</span>
          <span className="animate-bounce" style={{ animationDelay: '0.45s' }}>🪵</span>
          <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🏗️</span>
        </div>

        <div className="bg-gray-900/70 backdrop-blur-sm border border-green-500/30 rounded-2xl p-5 mb-4">
          <p className="text-gray-200 text-base leading-relaxed mb-3">
            Исследуй <span className="text-green-400 font-bold">огромный мир</span> с разными породами!
            Копай вглубь, находи руды и кристаллы. Собирай материалы, создавай инструменты и строй!
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-2xl">⛏️</div>
              <div className="text-xs text-gray-300">Копай блоки</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-2xl">💎</div>
              <div className="text-xs text-gray-300">Найди кристаллы</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-2xl">🔨</div>
              <div className="text-xs text-gray-300">Крафти предметы</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-2xl">🏗️</div>
              <div className="text-xs text-gray-300">Строй миры</div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
            <h3 className="text-yellow-400 font-bold text-sm mb-2">🌍 Слои мира:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ background: '#5a9e3a' }} />
                <span className="text-gray-300">Трава</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ background: '#8B6914' }} />
                <span className="text-gray-300">Земля</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ background: '#7f7f7f' }} />
                <span className="text-gray-300">Камень</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ background: '#3d3d4a' }} />
                <span className="text-gray-300">Сланец</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ background: '#4a4a4a' }} />
                <span className="text-gray-300">Уголь</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ background: '#8a7060' }} />
                <span className="text-gray-300">Железо</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ background: '#9a8a50' }} />
                <span className="text-gray-300">Золото</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ background: '#5a8a8a' }} />
                <span className="text-gray-300">Алмазы</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {subjects.map(s => (
              <div key={s.name} className="bg-gray-700/50 rounded-lg p-2 text-center border border-gray-600/30">
                <div className="text-2xl mb-0.5">{s.icon}</div>
                <div className="text-[10px] text-gray-300 font-medium leading-tight">{s.name}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onStart}
          className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white text-xl font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transform hover:scale-105 active:scale-95 transition-all duration-200"
        >
          ⛏️ Начать добычу!
        </button>

        <div className="mt-3 text-gray-400 text-xs">
          Клик для захвата мыши • ЛКМ — копать • ПКМ — ставить • E — инвентарь
        </div>
      </div>
    </div>
  );
}
