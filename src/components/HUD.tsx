import { ITEM_TYPES } from '../data/gameData';
import ItemIcon from './ItemIcon';

interface HUDProps {
  crystalsCollected: number;
  totalCrystals: number;
  questionsAnswered: number;
  correctAnswers: number;
  breakProgress: { progress: number; max: number; blockName: string } | null;
  hotbar: (string | null)[];
  selectedSlot: number;
  notification: string | null;
  crystalNotification: string | null;
  hasPortalKey: boolean;
  toolDurability: Record<string, number>;
}

export default function HUD({
  crystalsCollected, totalCrystals, questionsAnswered, correctAnswers,
  breakProgress, hotbar, selectedSlot, notification, crystalNotification,
  hasPortalKey, toolDurability
}: HUDProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
        <div className="pointer-events-auto bg-gray-900/90 backdrop-blur-sm border border-purple-500/50 rounded-xl px-4 py-2 flex items-center gap-3">
          <div className="text-2xl animate-pulse">💎</div>
          <div>
            <div className="text-purple-300 text-xs font-medium">Кристаллы</div>
            <div className="text-white font-bold text-lg">{crystalsCollected} / {totalCrystals}</div>
          </div>
        </div>

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

      {breakProgress && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
          <div className="bg-gray-900/90 backdrop-blur-sm border border-amber-500/50 rounded-xl px-6 py-3 min-w-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⛏️</span>
              <span className="text-amber-300 font-bold text-sm">Добыча: {breakProgress.blockName}</span>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
              <div 
                className="h-full transition-all duration-100 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                style={{ width: `${(breakProgress.progress / breakProgress.max) * 100}%` }}
              />
            </div>
            <div className="text-center text-xs text-gray-400 mt-1">
              {Math.round((breakProgress.progress / breakProgress.max) * 100)}%
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="bg-gray-900/95 backdrop-blur-sm border border-green-500/50 rounded-xl px-6 py-3">
            <div className="text-green-300 font-bold text-sm">{notification}</div>
          </div>
        </div>
      )}

      {crystalNotification && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 animate-pulse">
          <div className="bg-purple-900/95 backdrop-blur-sm border-2 border-purple-400 rounded-xl px-8 py-4 shadow-lg shadow-purple-500/50">
            <div className="text-purple-200 font-bold text-lg">{crystalNotification}</div>
          </div>
        </div>
      )}

      <div className="absolute top-20 right-4 pointer-events-auto">
        <div className="bg-gray-900/90 backdrop-blur-sm border border-purple-500/50 rounded-xl px-4 py-2">
          <div className="text-purple-300 text-xs font-bold mb-1">🎯 Цель:</div>
          <div className="text-white text-xs">
            {hasPortalKey 
              ? '🌀 Найди портал и активируй!' 
              : `💎 ${crystalsCollected}/${totalCrystals} кристаллов`}
          </div>
          {!hasPortalKey && (
            <div className="text-gray-400 text-[10px] mt-1">
              Собери 20💎 + 5💎 для ключа
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="flex gap-1 bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl p-2">
          {hotbar.map((item, i) => {
            const itemData = item ? ITEM_TYPES[item] : null;
            const durability = item && toolDurability[item] !== undefined ? toolDurability[item] : null;
            const maxDurability = item && ITEM_TYPES[item]?.durability ? ITEM_TYPES[item].durability! : null;
            
            return (
              <div
                key={i}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center relative transition-all
                  ${i === selectedSlot 
                    ? 'border-amber-400 bg-amber-900/30 scale-110 shadow-lg shadow-amber-500/30' 
                    : 'border-gray-600/50 bg-gray-800/50'}`}
              >
                {itemData && item && (
                  <ItemIcon itemId={item} size={28} />
                )}
                <span className="absolute -top-1 -left-1 text-[10px] text-gray-400 font-bold bg-gray-900 rounded px-0.5">
                  {i + 1}
                </span>
                {durability !== null && maxDurability !== null && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b">
                    <div 
                      className={`h-full rounded-b ${
                        durability / maxDurability > 0.5 ? 'bg-green-500' :
                        durability / maxDurability > 0.25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(durability / maxDurability) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {hotbar[selectedSlot] && (
          <div className="mt-2 text-center">
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-lg px-3 py-1 inline-block">
              <span className="text-amber-400 text-xs font-bold">
                ⛏️ {ITEM_TYPES[hotbar[selectedSlot]!].name}
              </span>
            </div>
          </div>
        )}
        {!hotbar[selectedSlot] && (
          <div className="mt-2 text-center">
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-lg px-3 py-1 inline-block">
              <span className="text-gray-400 text-xs">✋ Рука</span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-20 left-4 pointer-events-auto">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-3 py-2">
          <div className="text-gray-300 text-[10px] space-y-0.5">
            <div><span className="text-white font-bold">WASD</span> — ходить</div>
            <div><span className="text-white font-bold">ЛКМ</span> — копать</div>
            <div><span className="text-white font-bold">ПКМ</span> — ставить</div>
            <div><span className="text-white font-bold">E</span> — инвентарь</div>
            <div><span className="text-white font-bold">1-9</span> — слоты</div>
            <div><span className="text-white font-bold">Колёсико</span> — выбор</div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white/70" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white/70" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-1.5 bg-white/70" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-1.5 bg-white/70" />
        </div>
      </div>
    </div>
  );
}
