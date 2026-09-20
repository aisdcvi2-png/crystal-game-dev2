import { useState } from 'react';
import { ITEM_TYPES, CRAFT_RECIPES, CraftRecipe } from '../data/gameData';
import ItemIcon from './ItemIcon';

interface InventoryProps {
  hotbar: (string | null)[];
  inventory: (string | null)[];
  setHotbar: (hotbar: (string | null)[]) => void;
  setInventory: (inventory: (string | null)[]) => void;
  onCraft: (recipeId: string) => void;
  onClose: () => void;
  countItem: (itemId: string) => number;
  toolDurability: Record<string, number>;
}

export default function Inventory({ hotbar, inventory, setHotbar, setInventory, onCraft, onClose, countItem, toolDurability }: InventoryProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'craft' | 'manual'>('inventory');
  const [craftCategory, setCraftCategory] = useState<'tools' | 'materials' | 'building' | 'special'>('tools');
  const [selectedItem, setSelectedItem] = useState<{ item: string; from: 'hotbar' | 'inventory'; index: number } | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleSlotClick = (item: string | null, index: number, from: 'hotbar' | 'inventory') => {
    if (!item) {
      if (selectedItem) {
        if (from === 'hotbar') {
          const newHotbar = [...hotbar];
          newHotbar[index] = selectedItem.item;
          setHotbar(newHotbar);
          if (selectedItem.from === 'hotbar') {
            newHotbar[selectedItem.index] = null;
          } else {
            const newInventory = [...inventory];
            newInventory[selectedItem.index] = null;
            setInventory(newInventory);
          }
        } else {
          const newInventory = [...inventory];
          newInventory[index] = selectedItem.item;
          setInventory(newInventory);
          if (selectedItem.from === 'hotbar') {
            const newHotbar = [...hotbar];
            newHotbar[selectedItem.index] = null;
            setHotbar(newHotbar);
          } else {
            newInventory[selectedItem.index] = null;
          }
        }
        setSelectedItem(null);
      }
    } else {
      if (selectedItem) {
        if (selectedItem.from === 'hotbar' && from === 'hotbar') {
          const newHotbar = [...hotbar];
          newHotbar[selectedItem.index] = item;
          newHotbar[index] = selectedItem.item;
          setHotbar(newHotbar);
        } else if (selectedItem.from === 'inventory' && from === 'inventory') {
          const newInventory = [...inventory];
          newInventory[selectedItem.index] = item;
          newInventory[index] = selectedItem.item;
          setInventory(newInventory);
        } else if (selectedItem.from === 'hotbar' && from === 'inventory') {
          const newHotbar = [...hotbar];
          newHotbar[selectedItem.index] = item;
          setHotbar(newHotbar);
          const newInventory = [...inventory];
          newInventory[index] = selectedItem.item;
          setInventory(newInventory);
        } else {
          const newInventory = [...inventory];
          newInventory[selectedItem.index] = item;
          setInventory(newInventory);
          const newHotbar = [...hotbar];
          newHotbar[index] = selectedItem.item;
          setHotbar(newHotbar);
        }
        setSelectedItem(null);
      } else {
        setSelectedItem({ item, from, index });
      }
    }
  };

  const renderSlot = (item: string | null, index: number, isHotbar: boolean = false) => {
    const itemData = item ? ITEM_TYPES[item] : null;
    const isSelected = selectedItem && selectedItem.item === item && selectedItem.from === (isHotbar ? 'hotbar' : 'inventory') && selectedItem.index === index;
    const durability = item && toolDurability[item] !== undefined ? toolDurability[item] : null;
    const maxDurability = item && ITEM_TYPES[item]?.durability ? ITEM_TYPES[item].durability! : null;
    
    return (
      <div
        key={`${isHotbar ? 'h' : 'i'}-${index}`}
        onClick={() => handleSlotClick(item, index, isHotbar ? 'hotbar' : 'inventory')}
        onMouseEnter={() => item && setHoveredItem(item)}
        onMouseLeave={() => setHoveredItem(null)}
        className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center relative cursor-pointer transition-all
          ${isSelected ? 'border-yellow-400 bg-yellow-900/30 scale-110' : ''}
          ${isHotbar ? 'border-amber-500/50 bg-gray-800/80' : 'border-gray-600/50 bg-gray-800/60'}
          hover:border-white/50 hover:bg-gray-700/80`}
      >
        {itemData && item && (
          <>
            <ItemIcon itemId={item} size={36} />
            <span className="absolute bottom-0.5 right-1 text-xs text-white font-bold">
              {item ? countItem(item) : ''}
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
          </>
        )}
      </div>
    );
  };

  const canCraft = (recipe: CraftRecipe): boolean => {
    return recipe.ingredients.every(ing => countItem(ing.item) >= ing.count);
  };

  const filteredRecipes = CRAFT_RECIPES.filter(r => r.category === craftCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="bg-gray-900 border-2 border-gray-600 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">🎒 Инвентарь</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold px-3 py-1 rounded-lg hover:bg-gray-700">✕</button>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'inventory' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>🎒 Предметы</button>
          <button onClick={() => setActiveTab('craft')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'craft' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>🔨 Крафт</button>
          <button onClick={() => setActiveTab('manual')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>📖 Мануал</button>
        </div>

        {/* Tooltip */}
        {hoveredItem && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 z-50 pointer-events-none">
            <div className="text-white font-bold">{ITEM_TYPES[hoveredItem]?.name}</div>
            <div className="text-gray-400 text-sm">{ITEM_TYPES[hoveredItem]?.description}</div>
            {ITEM_TYPES[hoveredItem]?.toolSpeed && (
              <div className="text-green-400 text-xs">Скорость: x{ITEM_TYPES[hoveredItem].toolSpeed}</div>
            )}
            {ITEM_TYPES[hoveredItem]?.durability && (
              <div className="text-yellow-400 text-xs">Прочность: {toolDurability[hoveredItem] || ITEM_TYPES[hoveredItem].durability}/{ITEM_TYPES[hoveredItem].durability}</div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-4">
              <p className="text-blue-300 text-sm">💡 Кликни предмет чтобы взять, затем на слот чтобы положить</p>
            </div>
            <div className="mb-4">
              <h3 className="text-amber-400 font-bold mb-2 text-sm">⚡ Быстрый доступ (1-9)</h3>
              <div className="flex gap-2 flex-wrap">{hotbar.map((item, i) => renderSlot(item, i, true))}</div>
            </div>
            <div>
              <h3 className="text-gray-400 font-bold mb-2 text-sm">📦 Хранилище</h3>
              <div className="flex gap-2 flex-wrap">{inventory.map((item, i) => renderSlot(item, i, false))}</div>
            </div>
          </div>
        )}

        {activeTab === 'craft' && (
          <div>
            <div className="flex gap-2 mb-4">
              {(['tools', 'materials', 'building', 'special'] as const).map(cat => (
                <button key={cat} onClick={() => setCraftCategory(cat)} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${craftCategory === cat ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {cat === 'tools' ? '⛏️ Инструменты' : cat === 'materials' ? '🧱 Материалы' : cat === 'building' ? '🏗️ Строительство' : '✨ Особое'}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredRecipes.map(recipe => {
                const craftable = canCraft(recipe);
                return (
                  <div key={recipe.id} className={`rounded-xl p-3 border-2 ${craftable ? 'border-green-500/50 bg-green-900/20' : 'border-gray-600/30 bg-gray-800/30 opacity-60'}`} onClick={() => craftable && onCraft(recipe.id)}>
                    <div className="flex items-center gap-3">
                      <ItemIcon itemId={recipe.result.item} size={40} />
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm">{recipe.name}</div>
                        <div className="text-gray-400 text-xs">{recipe.description}</div>
                        {recipe.requiresQuestion && <div className="text-yellow-400 text-xs mt-1">⚠️ Нужен ответ на вопрос!</div>}
                      </div>
                      {craftable && <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold">Создать</button>}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {recipe.ingredients.map((ing, i) => {
                        const hasEnough = countItem(ing.item) >= ing.count;
                        return (
                          <div key={i} className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${hasEnough ? 'bg-green-800/30 text-green-300' : 'bg-red-800/30 text-red-300'}`}>
                            <ItemIcon itemId={ing.item} size={16} />
                            <span>{countItem(ing.item)}/{ing.count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="text-gray-300 space-y-4">
            <h3 className="text-xl font-bold text-white">📖 Мануал игры</h3>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-amber-400 font-bold mb-2">🎯 Цель игры</h4>
              <p className="text-sm">Собери 20 кристаллов, отвечая на вопросы по 5 предметам 2 класса. Кристаллы выпадают из руды при добыче!</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-amber-400 font-bold mb-2">⛏️ Управление</h4>
              <ul className="text-sm space-y-1">
                <li><span className="text-white font-bold">WASD</span> — движение</li>
                <li><span className="text-white font-bold">Мышь</span> — обзор (клик для захвата)</li>
                <li><span className="text-white font-bold">ЛКМ (удерж.)</span> — копать блок</li>
                <li><span className="text-white font-bold">ПКМ</span> — ставить блок</li>
                <li><span className="text-white font-bold">E</span> — инвентарь/крафт</li>
                <li><span className="text-white font-bold">1-9</span> — выбор слота</li>
                <li><span className="text-white font-bold">Колёсико</span> — переключение слотов</li>
                <li><span className="text-white font-bold">Пробел</span> — прыжок</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-amber-400 font-bold mb-2">⚒️ Кирки и прочность</h4>
              <p className="text-sm mb-2">Кирки изнашиваются при добыче! Более дорогие кирки быстрее и прочнее:</p>
              <ul className="text-sm space-y-1">
                <li>🪵 <span className="text-amber-300">Деревянная</span> — скорость x2, прочность 60</li>
                <li>🪨 <span className="text-gray-300">Каменная</span> — скорость x4, прочность 132</li>
                <li>⬜ <span className="text-gray-100">Железная</span> — скорость x6, прочность 251</li>
                <li>💎 <span className="text-cyan-300">Алмазная</span> — скорость x8, прочность 1562</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-amber-400 font-bold mb-2">💎 Кристаллы</h4>
              <p className="text-sm">Кристаллы случайно выпадают из руды! Подойди к светящемуся кристаллу чтобы подобрать. Затем ответь на вопрос — при правильном ответе кристалл засчитан!</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-amber-400 font-bold mb-2">🔨 Крафт</h4>
              <p className="text-sm mb-2">Создавай инструменты и материалы. Продвинутые кирки требуют ответа на вопрос!</p>
              <p className="text-sm">Каждые 5 правильных ответов = бонусные материалы. Каждые 10 = редкие ресурсы!</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-amber-400 font-bold mb-2">🌍 Слои мира</h4>
              <ul className="text-sm space-y-1">
                <li>🟩 <span className="text-green-300">Трава</span> — поверхность, даёт семена и саженцы</li>
                <li>🟫 <span className="text-amber-700">Земля</span> — можно сажать деревья</li>
                <li>⬜ <span className="text-gray-300">Камень</span> — содержит уголь и железо</li>
                <li>⬛ <span className="text-gray-500">Сланец</span> — глубины, содержит алмазы</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-700 text-center text-gray-500 text-xs">
          Нажмите <span className="text-white font-bold">E</span> чтобы закрыть
        </div>
      </div>
    </div>
  );
}
