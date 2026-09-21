import { useState } from 'react';
import { ITEM_TYPES, CRAFT_RECIPES } from '../data/gameData';
import ItemIcon from './ItemIcon';

interface WorkbenchProps {
  inventory: (string | null)[];
  setInventory: (inventory: (string | null)[]) => void;
  onCraft: (resultItem: string, count: number) => void;
  onClose: () => void;
}

export default function Workbench({ inventory, setInventory, onCraft, onClose }: WorkbenchProps) {
  const [craftGrid, setCraftGrid] = useState<(string | null)[]>(Array(9).fill(null));
  const [dragItem, setDragItem] = useState<{ item: string; from: 'inventory' | 'grid'; index: number } | null>(null);

  // Check if player has advanced workbench
  const hasAdvancedWorkbench = inventory.filter(item => item === 'advanced_workbench').length > 0;
  
  // Check if current grid matches any recipe
  const checkRecipe = () => {
    for (const recipe of CRAFT_RECIPES) {
      // Skip recipes that require advanced workbench if player doesn't have one
      if (recipe.requiresAdvancedWorkbench && !hasAdvancedWorkbench) {
        continue;
      }
      
      // Create pattern from ingredients
      const pattern = Array(9).fill(null);
      let patternIndex = 0;
      
      for (const ing of recipe.ingredients) {
        for (let i = 0; i < ing.count; i++) {
          if (patternIndex < 9) {
            pattern[patternIndex] = ing.item;
            patternIndex++;
          }
        }
      }
      
      // Check if grid matches pattern (allowing rotation/mirroring)
      if (matchesPattern(craftGrid, pattern)) {
        return recipe;
      }
    }
    return null;
  };

  // Simple pattern matching (exact match for now)
  const matchesPattern = (grid: (string | null)[], pattern: (string | null)[]): boolean => {
    // Count items in grid
    const gridCounts: Record<string, number> = {};
    grid.forEach(item => {
      if (item) gridCounts[item] = (gridCounts[item] || 0) + 1;
    });
    
    // Count items in pattern
    const patternCounts: Record<string, number> = {};
    pattern.forEach(item => {
      if (item) patternCounts[item] = (patternCounts[item] || 0) + 1;
    });
    
    // Compare counts
    const gridKeys = Object.keys(gridCounts);
    const patternKeys = Object.keys(patternCounts);
    
    if (gridKeys.length !== patternKeys.length) return false;
    
    for (const key of patternKeys) {
      if (gridCounts[key] !== patternCounts[key]) return false;
    }
    
    return true;
  };

  const matchedRecipe = checkRecipe();

  const handleInventoryClick = (item: string | null, index: number) => {
    if (!item) return;
    
    if (dragItem) {
      // Swap or place
      if (dragItem.from === 'inventory') {
        // Swap within inventory
        const newInv = [...inventory];
        newInv[dragItem.index] = item;
        newInv[index] = dragItem.item;
        setInventory(newInv);
      } else {
        // Move from grid to inventory
        const newGrid = [...craftGrid];
        newGrid[dragItem.index] = item;
        setCraftGrid(newGrid);
        
        const newInv = [...inventory];
        newInv[index] = dragItem.item;
        setInventory(newInv);
      }
      setDragItem(null);
    } else {
      setDragItem({ item, from: 'inventory', index });
    }
  };

  const handleGridClick = (index: number) => {
    const gridItem = craftGrid[index];
    
    if (dragItem) {
      // Place or swap
      const newGrid = [...craftGrid];
      
      if (dragItem.from === 'grid') {
        // Swap within grid
        newGrid[dragItem.index] = gridItem;
        newGrid[index] = dragItem.item;
        setCraftGrid(newGrid);
      } else {
        // Move from inventory to grid
        newGrid[index] = dragItem.item;
        setCraftGrid(newGrid);
        
        const newInv = [...inventory];
        newInv[dragItem.index] = gridItem;
        setInventory(newInv);
      }
      setDragItem(null);
    } else if (gridItem) {
      // Pick up from grid
      setDragItem({ item: gridItem, from: 'grid', index });
    }
  };

  const handleCraft = () => {
    if (!matchedRecipe) return;
    
    // Remove items from grid
    setCraftGrid(Array(9).fill(null));
    
    // Give result
    onCraft(matchedRecipe.result.item, matchedRecipe.result.count);
  };

  const handleDropOutside = () => {
    if (dragItem && dragItem.from === 'grid') {
      // Drop item from grid (destroy it)
      const newGrid = [...craftGrid];
      newGrid[dragItem.index] = null;
      setCraftGrid(newGrid);
      setDragItem(null);
    } else if (dragItem && dragItem.from === 'inventory') {
      // Drop item from inventory (destroy it)
      const newInv = [...inventory];
      newInv[dragItem.index] = null;
      setInventory(newInv);
      setDragItem(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="bg-gray-900 border-2 border-amber-600 rounded-2xl p-6 max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">🔨 Верстак 3x3</h2>
            {!hasAdvancedWorkbench && (
              <p className="text-yellow-400 text-xs mt-1">⚠️ Базовый режим (2x2). Создайте верстак 3x3 для всех рецептов!</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold px-3 py-1 rounded-lg hover:bg-gray-700">✕</button>
        </div>

        <div className="flex gap-6">
          {/* Crafting Grid */}
          <div className="flex flex-col items-center">
            <h3 className="text-amber-400 font-bold mb-2 text-sm">Сетка крафта 3x3</h3>
            <div className="grid grid-cols-3 gap-2 bg-gray-800 p-3 rounded-lg border-2 border-amber-600/50">
              {craftGrid.map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleGridClick(i)}
                  className="w-16 h-16 rounded-lg border-2 border-gray-600 bg-gray-700 flex items-center justify-center cursor-pointer hover:border-amber-400 transition-all"
                >
                  {item && <ItemIcon itemId={item} size={40} />}
                </div>
              ))}
            </div>
            
            {/* Result */}
            <div className="mt-4 flex items-center gap-4">
              <div className="text-3xl">→</div>
              <div className="w-20 h-20 rounded-lg border-2 border-green-500 bg-green-900/30 flex items-center justify-center">
                {matchedRecipe && <ItemIcon itemId={matchedRecipe.result.item} size={48} />}
              </div>
              {matchedRecipe && (
                <button
                  onClick={handleCraft}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                >
                  Создать x{matchedRecipe.result.count}
                </button>
              )}
            </div>
          </div>

          {/* Inventory */}
          <div className="flex-1">
            <h3 className="text-gray-400 font-bold mb-2 text-sm">📦 Инвентарь</h3>
            <div className="flex gap-2 flex-wrap bg-gray-800 p-3 rounded-lg">
              {inventory.map((item, i) => {
                const isSelected = dragItem && dragItem.item === item && dragItem.from === 'inventory' && dragItem.index === i;
                return (
                  <div
                    key={i}
                    onClick={() => handleInventoryClick(item, i)}
                    className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                      isSelected ? 'border-yellow-400 bg-yellow-900/30 scale-110' : 'border-gray-600 bg-gray-700 hover:border-white/50'
                    }`}
                  >
                    {item && <ItemIcon itemId={item} size={36} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
          <p className="text-blue-300 text-sm">
            💡 Кликайте на предметы чтобы перемещать их между инвентарём и сеткой крафта. 
            Перетащите нужные материалы в сетку 3x3 согласно рецепту.
          </p>
        </div>

        {/* Drop zone indicator */}
        {dragItem && (
          <div
            onClick={handleDropOutside}
            className="mt-4 bg-red-900/20 border-2 border-red-500/50 rounded-lg p-3 text-center cursor-pointer hover:bg-red-900/30"
          >
            <p className="text-red-300 text-sm">🗑️ Нажмите здесь чтобы выбросить предмет</p>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-700 text-center text-gray-500 text-xs">
          Нажмите <span className="text-white font-bold">ESC</span> чтобы закрыть
        </div>
      </div>
    </div>
  );
}
