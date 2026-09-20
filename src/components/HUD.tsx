import { subjects } from '../data/questions';

interface HUDProps {
  crystalsCollected: number;
  totalCrystals: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentSubject: string | null;
  onStartQuestion: () => void;
  breakProgress: { progress: number; max: number; isOre: boolean } | null;
}

export default function HUD({ crystalsCollected, totalCrystals, questionsAnswered, correctAnswers, currentSubject, onStartQuestion, breakProgress }: HUDProps) {
  const subject = subjects.find(s => s.name === currentSubject);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
        {/* Crystal counter */}
        <div className="pointer-events-auto bg-gray-900/90 backdrop-blur-sm border border-purple-500/50 rounded-xl px-4 py-2 flex items-center gap-3">
          <div className="text-2xl animate-pulse">💎</div>
          <div>
            <div className="text-purple-300 text-xs font-medium">Кристаллы</div>
            <div className="text-white font-bold text-lg">{crystalsCollected} / {totalCrystals}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="pointer-events-auto bg-gray-900/90 backdrop-blur-sm border border-blue-500/50 rounded-xl px-4 py-2">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-blue-300 text-xs">Вопросы</div>
              <div className="text-white font-bold">{questionsAnswered}/100</div>
            </div>
            <div className="w-px h-8 bg-gray-600" />
            <div className="text-center">
              <div className="text-green-300 text-xs">Верно</div>
              <div className="text-white font-bold">{correctAnswers}</div>
            </div>
            <div className="w-px h-8 bg-gray-600" />
            <div className="text-center">
              <div className="text-yellow-300 text-xs">Точность</div>
              <div className="text-white font-bold">
                {questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mining progress bar - center bottom */}
      {breakProgress && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
          <div className="bg-gray-900/90 backdrop-blur-sm border border-amber-500/50 rounded-xl px-6 py-3 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⛏️</span>
              <span className="text-amber-300 font-bold text-sm">
                {breakProgress.isOre ? 'Добыча руды...' : 'Разрушение камня...'}
              </span>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
              <div 
                className={`h-full transition-all duration-150 rounded-full ${
                  breakProgress.isOre 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-300'
                }`}
                style={{ width: `${(breakProgress.progress / breakProgress.max) * 100}%` }}
              />
            </div>
            <div className="text-center text-xs text-gray-400 mt-1">
              {breakProgress.progress} / {breakProgress.max}
            </div>
          </div>
        </div>
      )}

      {/* Subject indicator when question available */}
      {currentSubject && !breakProgress && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="bg-gray-900/90 backdrop-blur-sm border-2 border-yellow-500/50 rounded-xl px-6 py-3 text-center">
            <div className="text-3xl mb-1">{subject?.icon}</div>
            <div className="text-yellow-300 font-bold text-sm">Следующий предмет: {currentSubject}</div>
            <button 
              onClick={onStartQuestion}
              className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 active:scale-95"
            >
              📝 Ответить на вопрос
            </button>
          </div>
        </div>
      )}

      {/* Controls hint - mining focused */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <div className="bg-gray-900/90 backdrop-blur-sm border border-amber-600/50 rounded-xl px-4 py-3">
          <div className="text-amber-300 text-xs font-bold mb-2">⛏️ Управление:</div>
          <div className="text-gray-300 text-xs space-y-1">
            <div><span className="text-white font-bold">WASD</span> — движение</div>
            <div><span className="text-white font-bold">Мышь</span> — обзор</div>
            <div><span className="text-white font-bold">ЛКМ (удерж.)</span> — ⛏️ добыча блока</div>
            <div><span className="text-white font-bold">Пробел</span> — прыжок</div>
            <div><span className="text-white font-bold">Клик</span> — захват мыши</div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="text-cyan-300 text-xs">💡 Ищи светящиеся блоки — в них кристаллы!</div>
          </div>
        </div>
      </div>

      {/* Subject selector at bottom */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-3">
          <div className="text-gray-300 text-xs mb-2 font-bold">📚 Предметы:</div>
          <div className="flex gap-2">
            {subjects.map(s => (
              <div key={s.name} className="text-center" title={s.name}>
                <div className="text-2xl">{s.icon}</div>
                <div className="text-[10px] text-gray-400">{s.name.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crosshair - pickaxe style */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg shadow-white/50" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2.5 bg-white/70" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2.5 bg-white/70" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-2.5 bg-white/70" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-2.5 bg-white/70" />
        </div>
      </div>
    </div>
  );
}
