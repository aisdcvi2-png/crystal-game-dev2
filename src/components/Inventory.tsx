import { useState } from 'react';
import { ITEM_TYPES, CRAFT_RECIPES, CraftRecipe } from '../data/gameData';

interface InventoryProps {
  hotbar: (string | null)[];
  inventory: (string | null)[];
  onCraft: (recipeId: string) => void;
  onClose: () => void;
  countItem: (itemId: string) => number;
}

export default function Inventory({ hotbar, inventory, onCraft, onClose, countItem }: InventoryProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'craft'>('inventory');
  const [craftCategory, setCraftCategory] = useState<'tools' | 'materials' | 'building'>('tools');

  const renderSlot = (item: string | null, index: number, isHotbar: boolean = false) => {
    const itemData = item ? ITEM_TYPES[item] : null;
    
    return (
      <div
        key={`${isHotbar ? 'h' : 'i'}-${index}`}
        className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center relative cursor-pointer transition-all
          ${isHotbar ? 'border-amber-500/50 bg-gray-800/80' : 'border-gray-600/50 bg-gray-800/60'}
          hover:border-white/50 hover:bg-gray-700/80`}
        title={itemData ? `${itemData.name}` : 'Пусто'}
      >
        {itemData && (
          <>
            <span className="text-2xl">{itemData.icon}</span>
            <span className="absolute bottom-0.5 right-1 text-xs text-white font-bold">
              {item ? countItem(item) : ''}
            </span>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="bg-gray-900 border-2 border-gray-600 rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">🎒 Инвентарь</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'inventory'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎒 Предметы
          </button>
          <button
            onClick={() => setActiveTab('craft')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'craft'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🔨 Крафт
          </button>
        </div>

        {activeTab === 'inventory' && (
          <div>
            {/* Hotbar */}
            <div className="mb-4">
              <h3 className="text-amber-400 font-bold mb-2 text-sm">⚡ Быстрый доступ (1-9)</h3>
              <div className="flex gap-2 flex-wrap">
                {hotbar.map((item, i) => renderSlot(item, i, true))}
              </div>
            </div>

            {/* Main inventory */}
            <div>
              <h3 className="text-gray-400 font-bold mb-2 text-sm">📦 Хранилище</h3>
              <div className="flex gap-2 flex-wrap">
                {inventory.map((item, i) => renderSlot(item, i, false))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'craft' && (
          <div>
            {/* Craft categories */}
            <div className="flex gap-2 mb-4">
              {(['tools', 'materials', 'building'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCraftCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                    craftCategory === cat
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {cat === 'tools' ? '⛏️ Инструменты' : cat === 'materials' ? '🧱 Материалы' : '🏗️ Строительство'}
                </button>
              ))}
            </div>

            {/* Recipes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredRecipes.map(recipe => {
                const craftable = canCraft(recipe);
                return (
                  <div
                    key={recipe.id}
                    className={`rounded-xl p-3 border-2 transition-all ${
                      craftable
                        ? 'border-green-500/50 bg-green-900/20 hover:bg-green-900/30 cursor-pointer'
                        : 'border-gray-600/30 bg-gray-800/30 opacity-60'
                    }`}
                    onClick={() => craftable && onCraft(recipe.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{recipe.icon}</span>
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm">{recipe.name}</div>
                        <div className="text-xs text-gray-400">
                          Результат: x{recipe.result.count}
                        </div>
                      </div>
                      {craftable && (
                        <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold hover:bg-green-500 transition-colors">
                          Создать
                        </button>
                      )}
                    </div>
                    
                    {/* Ingredients */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {recipe.ingredients.map((ing, i) => {
                        const ingData = ITEM_TYPES[ing.item];
                        const hasEnough = countItem(ing.item) >= ing.count;
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                              hasEnough ? 'bg-green-800/30 text-green-300' : 'bg-red-800/30 text-red-300'
                            }`}
                          >
                            <span>{ingData?.icon || '?'}</span>
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

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-700 text-center text-gray-500 text-xs">
          Нажмите <span className="text-white font-bold">E</span> чтобы закрыть • 
          Колёсико мыши для выбора слота • <span className="text-white font-bold">ПКМ</span> для установки блока
        </div>
      </div>
    </div>
  );
}
