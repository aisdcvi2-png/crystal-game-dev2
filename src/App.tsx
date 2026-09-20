import { useState, useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import GameWorld from './components/GameWorld';
import { questions, subjects, Question } from './data/questions';
import { BLOCK_TYPES, ITEM_TYPES, CRAFT_RECIPES, TOOL_DURABILITY } from './data/gameData';
import ItemIcon from './components/ItemIcon';

type GameState = 'start' | 'playing' | 'question' | 'win' | 'victory';
interface DroppedCrystal { id: number; x: number; y: number; z: number; }

// ============ QUESTION MODAL ============
function QuestionModal({ question, onAnswer, answeredIds }: { question: Question; onAnswer: (correct: boolean) => void; answeredIds: number[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const subject = subjects.find(s => s.name === question.subject);

  useEffect(() => {
    if (showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); setIsCorrect(false); setShowResult(true); setTimeout(() => onAnswer(false), 1500); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult, onAnswer]);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
    const correct = index === question.correct;
    setIsCorrect(correct);
    setShowResult(true);
    setTimeout(() => onAnswer(correct), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="bg-gray-900 border-2 border-purple-500 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{subject?.icon}</span>
            <span className="text-white font-bold text-lg">{question.subject}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${timeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-500/20 text-blue-300'}`}>
            ⏱ {timeLeft}с
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <p className="text-white text-lg font-medium">{question.question}</p>
          <div className="text-gray-400 text-sm mt-2">Вопрос #{question.id} из 100</div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => {
            let btnClass = 'bg-gray-800 border-2 border-gray-600 hover:border-purple-400 hover:bg-gray-700 text-white';
            if (showResult) {
              if (index === question.correct) btnClass = 'bg-green-600/30 border-2 border-green-400 text-green-300';
              else if (index === selected && !isCorrect) btnClass = 'bg-red-600/30 border-2 border-red-400 text-red-300';
              else btnClass = 'bg-gray-800/50 border-2 border-gray-700 text-gray-500';
            }
            return (
              <button key={index} onClick={() => handleSelect(index)} disabled={showResult}
                className={`${btnClass} rounded-xl px-4 py-3 text-left font-medium transition-all`}>
                <span className="inline-flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-sm font-bold">{String.fromCharCode(65 + index)}</span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
        {showResult && (
          <div className={`mt-4 p-3 rounded-xl text-center font-bold text-lg ${isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {isCorrect ? '✅ Правильно! +1 кристалл' : '❌ Неправильно!'}
          </div>
        )}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Прогресс</span><span>{answeredIds.length}/100</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full" style={{ width: `${(answeredIds.length / 100) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ START SCREEN ============
function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto" style={{ background: 'linear-gradient(135deg, #1a472a, #2d5016, #1a3a1a)' }}>
      <div className="relative text-center p-6 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ background: 'linear-gradient(to right, #FFD700, #FFA500, #FF6347)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ⛏️ Кристальный Шахтёр 3D
        </h1>
        <p className="text-lg text-green-200 mb-6">Исследуй мир, собирай кристаллы, отвечай на вопросы!</p>
        <div className="text-5xl mb-6 flex items-center justify-center gap-3">
          <div className="animate-bounce" style={{ animationDelay: '0s' }}>
            <svg width="48" height="48" viewBox="0 0 32 32">
              <rect x="14" y="14" width="4" height="14" fill="#8B4513"/>
              <rect x="8" y="8" width="16" height="6" fill="#808080"/>
            </svg>
          </div>
          <div className="animate-bounce" style={{ animationDelay: '0.15s' }}>
            <svg width="48" height="48" viewBox="0 0 32 32">
              <polygon points="16,4 24,12 20,28 12,28 8,12" fill="#E040FB"/>
            </svg>
          </div>
          <div className="animate-bounce" style={{ animationDelay: '0.3s' }}>
            <svg width="48" height="48" viewBox="0 0 32 32">
              <rect x="4" y="4" width="24" height="24" fill="#808080"/>
              <rect x="6" y="6" width="8" height="8" fill="#A0A0A0"/>
            </svg>
          </div>
          <div className="animate-bounce" style={{ animationDelay: '0.45s' }}>
            <svg width="48" height="48" viewBox="0 0 32 32">
              <rect x="4" y="4" width="24" height="24" fill="#8B4513"/>
              <line x1="4" y1="12" x2="28" y2="12" stroke="#654321" stroke-width="2"/>
              <line x1="4" y1="20" x2="28" y2="20" stroke="#654321" stroke-width="2"/>
            </svg>
          </div>
        </div>
        <div className="bg-gray-900/70 backdrop-blur-sm border border-green-500/30 rounded-2xl p-5 mb-6">
          <p className="text-gray-200 text-base leading-relaxed mb-4">
            Копай блоки киркой, находи кристаллы в руде! Чтобы получить кристалл — ответь правильно на вопрос по школьной программе 2 класса. Собери 20 кристаллов и 5 алмазов, скрафти ключ портала и найди портал в углу карты!
          </p>
          <div className="grid grid-cols-5 gap-3">
            {subjects.map(s => (
              <div key={s.name} className="bg-gray-700/50 rounded-lg p-2 text-center border border-gray-600/30">
                <div className="text-2xl mb-0.5">{s.icon}</div>
                <div className="text-[10px] text-gray-300 font-medium leading-tight">{s.name}</div>
                <div className="text-[9px] text-gray-500">20 вопросов</div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onStart} className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white text-xl font-bold px-10 py-4 rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all">
          ⛏️ Начать игру!
        </button>
        <p className="text-gray-400 text-xs mt-3">WASD — ходить • ЛКМ — копать • ПКМ — ставить • E — инвентарь</p>
      </div>
    </div>
  );
}

// ============ WIN SCREEN ============
function WinScreen({ crystalsCollected, correctAnswers, totalQuestions, onRestart }: { crystalsCollected: number; correctAnswers: number; totalQuestions: number; onRestart: () => void }) {
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      <div className="text-center p-8 max-w-lg">
        <div className="text-8xl mb-6 animate-bounce">🏆</div>
        <h1 className="text-5xl font-bold text-white mb-4">Поздравляем!</h1>
        <p className="text-xl text-gray-300 mb-6">Ты собрал все кристаллы!</p>
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center"><div className="text-3xl font-bold text-purple-400">{crystalsCollected}</div><div className="text-sm text-gray-400">Кристаллов</div></div>
            <div className="text-center"><div className="text-3xl font-bold text-green-400">{correctAnswers}</div><div className="text-sm text-gray-400">Правильных</div></div>
            <div className="text-center"><div className="text-3xl font-bold text-yellow-400">{accuracy}%</div><div className="text-sm text-gray-400">Точность</div></div>
          </div>
        </div>
        <button onClick={onRestart} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold px-10 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all">
          🔄 Играть снова!
        </button>
      </div>
    </div>
  );
}

// ============ MAIN APP ============
function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [crystalsCollected, setCrystalsCollected] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredIds, setAnsweredIds] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [availableCrystals, setAvailableCrystals] = useState<number[]>(Array.from({ length: 20 }, (_, i) => i));
  // Break progress removed - using visual cracks instead
  const [showInventory, setShowInventory] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [crystalNotification, setCrystalNotification] = useState<string | null>(null);
  const [hotbar, setHotbar] = useState<(string | null)[]>(['wood_pickaxe', null, null, null, null, null, null, null, null]);
  const [inventory, setInventory] = useState<(string | null)[]>(['oak_log_item', 'oak_log_item', 'oak_log_item', ...Array(24).fill(null)]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [droppedCrystals, setDroppedCrystals] = useState<DroppedCrystal[]>([]);
  const [pendingCrystalId, setPendingCrystalId] = useState<number | null>(null);
  const [toolDurability, setToolDurability] = useState<Record<string, number>>({ wood_pickaxe: TOOL_DURABILITY.wood });
  const [dragItem, setDragItem] = useState<{ item: string; from: 'hotbar' | 'inventory'; index: number } | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ from: 'hotbar' | 'inventory'; index: number } | null>(null);
  const [portalActivated, setPortalActivated] = useState(false);
  const [crystalPositions, setCrystalPositions] = useState<Array<{id: number, x: number, y: number, z: number, collected: boolean}>>([]);
  const [showCrystalChoice, setShowCrystalChoice] = useState(false);
  const [crystalTimer, setCrystalTimer] = useState<number | null>(null);
  const [pendingCrystal, setPendingCrystal] = useState<number | null>(null);

  const playerPosition = useRef(new THREE.Vector3(0, 3, 0));
  const subjectIndexRef = useRef(0);
  const notifTimeoutRef = useRef<any>(null);
  const hotbarRef = useRef(hotbar);
  const inventoryRef = useRef(inventory);

  // Keep refs updated
  useEffect(() => { hotbarRef.current = hotbar; }, [hotbar]);
  useEffect(() => { inventoryRef.current = inventory; }, [inventory]);

  const showNotif = useCallback((msg: string) => {
    setNotification(msg);
    if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
    notifTimeoutRef.current = setTimeout(() => setNotification(null), 2500);
  }, []);

  useEffect(() => {
    if (gameState === 'question' && document.pointerLockElement) document.exitPointerLock();
  }, [gameState]);

  const damageTool = useCallback(() => {
    const itemId = hotbar[selectedSlot];
    if (!itemId) return;
    const itemData = ITEM_TYPES[itemId];
    if (!itemData?.durability) return;
    setToolDurability(prev => {
      const current = prev[itemId] ?? itemData.durability!;
      const newDurability = current - 1;
      if (newDurability <= 0) {
        setHotbar(h => { const newH = [...h]; newH[selectedSlot] = null; return newH; });
        showNotif('⚠️ Кирка сломалась!');
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newDurability };
    });
  }, [hotbar, selectedSlot, showNotif]);

  const addItem = useCallback((itemId: string, count: number = 1) => {
    const itemData = ITEM_TYPES[itemId];
    if (!itemData) return;
    
    // Add all items at once to inventory
    setInventory(prev => {
      const newInv = [...prev];
      let added = 0;
      
      // Find empty slots and add items
      for (let i = 0; i < 27 && added < count; i++) {
        if (!newInv[i]) {
          newInv[i] = itemId;
          added++;
        }
      }
      
      // Update ref
      inventoryRef.current = newInv;
      
      // If we couldn't add all items to inventory, add remaining to hotbar
      if (added < count) {
        const remaining = count - added;
        setHotbar(prevHotbar => {
          const newHotbar = [...prevHotbar];
          let hotbarAdded = 0;
          
          for (let i = 0; i < 9 && hotbarAdded < remaining; i++) {
            if (!newHotbar[i]) {
              newHotbar[i] = itemId;
              hotbarAdded++;
            }
          }
          
          hotbarRef.current = newHotbar;
          return newHotbar;
        });
      }
      
      return newInv;
    });
    
    showNotif(`+${count} ${itemData.name}`);
  }, [showNotif]);

  const removeItem = useCallback((itemId: string, count: number = 1): boolean => {
    // Remove from inventory
    setInventory(prev => {
      const newInv = [...prev];
      let removed = 0;
      
      for (let i = 0; i < 27 && removed < count; i++) {
        if (newInv[i] === itemId) {
          newInv[i] = null;
          removed++;
        }
      }
      
      inventoryRef.current = newInv;
      
      // If we removed all items, return
      if (removed >= count) {
        return newInv;
      }
      
      // Otherwise, remove remaining from hotbar
      const remaining = count - removed;
      setHotbar(prevHotbar => {
        const newHotbar = [...prevHotbar];
        let hotbarRemoved = 0;
        
        for (let i = 0; i < 9 && hotbarRemoved < remaining; i++) {
          if (newHotbar[i] === itemId) {
            newHotbar[i] = null;
            hotbarRemoved++;
          }
        }
        
        hotbarRef.current = newHotbar;
        return newHotbar;
      });
      
      return newInv;
    });
    
    return true;
  }, []);

  const countItem = useCallback((itemId: string): number => {
    let count = 0;
    hotbarRef.current.forEach(item => { if (item === itemId) count++; });
    inventoryRef.current.forEach(item => { if (item === itemId) count++; });
    return count;
  }, []);

  const getNextQuestion = useCallback((): Question | null => {
    const unanswered = questions.filter(q => !answeredIds.includes(q.id));
    if (unanswered.length === 0) return null;
    const currentSubjectName = subjects[subjectIndexRef.current % subjects.length].name;
    const subjectQuestions = unanswered.filter(q => q.subject === currentSubjectName);
    if (subjectQuestions.length > 0) return subjectQuestions[Math.floor(Math.random() * subjectQuestions.length)];
    subjectIndexRef.current++;
    const remaining = questions.filter(q => !answeredIds.includes(q.id));
    if (remaining.length > 0) return remaining[Math.floor(Math.random() * remaining.length)];
    return null;
  }, [answeredIds]);

  const handleBlockMined = useCallback((blockType: string, x: number, y: number, z: number) => {
    const blockData = BLOCK_TYPES[blockType];
    if (!blockData) return;
    damageTool();
    if (blockData.drops) blockData.drops.forEach(drop => { if (Math.random() < drop.chance) addItem(drop.item, drop.count); });
    
    // Check if this block is near a crystal position
    const crystalRadius = 3; // blocks radius to trigger crystal spawn
    const nearbyCrystal = crystalPositions.find(cp => {
      const dx = cp.x - x;
      const dy = cp.y - y;
      const dz = cp.z - z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      return distance <= crystalRadius && !cp.collected;
    });
    
    if (nearbyCrystal && availableCrystals.length > 0) {
      const crystalId = nearbyCrystal.id;
      setCrystalPositions(prev => prev.map(cp => 
        cp.id === crystalId ? { ...cp, collected: true } : cp
      ));
      setAvailableCrystals(prev => prev.slice(1));
      setDroppedCrystals(prev => [...prev, { id: crystalId, x: nearbyCrystal.x, y: nearbyCrystal.y + 1, z: nearbyCrystal.z }]);
      setCrystalNotification('💎 Откопан кристалл! Подойди чтобы подобрать!');
      setTimeout(() => setCrystalNotification(null), 3000);
    }
    
    // Regular rare drops (excluding crystals)
    if (blockData.rareDrops) {
      blockData.rareDrops.forEach(drop => {
        if (Math.random() < drop.chance && drop.item !== 'crystal') {
          addItem(drop.item, drop.count);
        }
      });
    }
  }, [addItem, damageTool, crystalPositions, availableCrystals]);

  const handleCrystalPickup = useCallback((crystalId: number) => {
    setDroppedCrystals(prev => prev.filter(c => c.id !== crystalId));
    setPendingCrystal(crystalId);
    setShowCrystalChoice(true);
    setCrystalNotification('✨ Кристалл подобран!');
    setTimeout(() => setCrystalNotification(null), 2000);
    if (document.pointerLockElement) document.exitPointerLock();
  }, []);

  const handleAnswerNow = useCallback(() => {
    setShowCrystalChoice(false);
    setPendingCrystalId(pendingCrystal);
    subjectIndexRef.current = (subjectIndexRef.current + 1) % subjects.length;
    setCurrentSubject(subjects[subjectIndexRef.current].name);
    setTimeout(() => {
      const question = getNextQuestion();
      if (question) { setCurrentQuestion(question); setGameState('question'); }
    }, 300);
  }, [pendingCrystal, getNextQuestion]);

  const handleAnswerLater = useCallback(() => {
    setShowCrystalChoice(false);
    setCrystalTimer(60); // 60 seconds to answer
    setPendingCrystalId(pendingCrystal);
    setCrystalNotification('⏰ У тебя 60 секунд чтобы ответить на вопрос!');
    setTimeout(() => setCrystalNotification(null), 3000);
  }, [pendingCrystal]);

  // Timer countdown for crystal
  useEffect(() => {
    if (crystalTimer === null || crystalTimer <= 0) return;
    
    const interval = setInterval(() => {
      setCrystalTimer(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          // Time's up - crystal destroyed
          clearInterval(interval);
          setPendingCrystalId(null);
          setCrystalNotification('💔 Кристалл разрушился!');
          setTimeout(() => setCrystalNotification(null), 3000);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [crystalTimer]);

  const handleStart = () => {
    // Generate evenly distributed crystal positions
    const positions = [];
    const gridSize = 5; // 5x4 grid for 20 crystals
    const mapSize = 64;
    const cellWidth = mapSize / gridSize;
    const cellHeight = mapSize / 4;
    
    for (let i = 0; i < 20; i++) {
      const gridX = i % gridSize;
      const gridZ = Math.floor(i / gridSize);
      
      // Random position within grid cell
      const x = Math.floor(gridX * cellWidth + Math.random() * cellWidth);
      const z = Math.floor(gridZ * cellHeight + Math.random() * cellHeight);
      
      // Find surface height at this position
      const y = 5; // Default height, will be adjusted in GameWorld
      
      positions.push({ id: i, x, y, z, collected: false });
    }
    
    setCrystalPositions(positions);
    setGameState('playing');
    setCurrentSubject(subjects[0].name);
  };

  const handleStartQuestion = () => {
    if (document.pointerLockElement) document.exitPointerLock();
    const question = getNextQuestion();
    if (question) { setCurrentQuestion(question); setGameState('question'); }
  };

  const handleAnswer = (correct: boolean) => {
    if (currentQuestion) {
      setAnsweredIds(prev => [...prev, currentQuestion.id]);
      if (correct) {
        setCorrectAnswers(prev => prev + 1);
        const qNum = currentQuestion.id;
        if (qNum % 10 === 0) { addItem('diamond', 2); addItem('gold_ingot', 3); showNotif('🏆 Превосходно! +2💎 +3🟡'); }
        else if (qNum % 5 === 0) { addItem('iron_ingot', 2); addItem('coal', 3); showNotif('⭐ Отлично! +2⬜ +3⚫'); }
        else { addItem('cobblestone', 3); addItem('stick', 2); }
        if (pendingCrystalId !== null) { setCrystalsCollected(prev => prev + 1); setPendingCrystalId(null); }
      } else {
        if (pendingCrystalId !== null) { setAvailableCrystals(prev => [...prev, pendingCrystalId]); setPendingCrystalId(null); }
        showNotif('❌ Неправильно!');
      }
    }
    setCurrentQuestion(null);
    setCrystalTimer(null); // Reset timer
    const totalAnswered = answeredIds.length + 1;
    if (totalAnswered >= 100) setGameState('win');
    else setGameState('playing');
  };

  // Break progress removed - using visual cracks on blocks

  const handlePlaceBlock = useCallback((x: number, y: number, z: number) => {
    const itemId = hotbar[selectedSlot];
    if (!itemId) return;
    const itemData = ITEM_TYPES[itemId];
    if (!itemData?.placeable) { showNotif('Нельзя поставить!'); return; }
    removeItem(itemId, 1);
  }, [hotbar, selectedSlot, removeItem, showNotif]);

  const handleCraft = useCallback((recipeId: string) => {
    const recipe = CRAFT_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;
    
    // Check if workbench is required
    if (recipe.requiresWorkbench) {
      const workbenchCount = hotbarRef.current.filter(item => item === 'crafting_table').length +
                            inventoryRef.current.filter(item => item === 'crafting_table').length;
      if (workbenchCount === 0) {
        showNotif('⚠️ Нужен верстак!');
        return;
      }
    }
    
    // Check if we have all ingredients using refs
    const hasAll = recipe.ingredients.every(ing => {
      const count = hotbarRef.current.filter(item => item === ing.item).length +
                   inventoryRef.current.filter(item => item === ing.item).length;
      return count >= ing.count;
    });
    
    if (!hasAll) {
      showNotif('Недостаточно материалов!');
      return;
    }
    
    // Remove all ingredients at once
    setInventory(prev => {
      const newInv = [...prev];
      
      // Remove each ingredient
      recipe.ingredients.forEach(ing => {
        let removed = 0;
        for (let i = 0; i < 27 && removed < ing.count; i++) {
          if (newInv[i] === ing.item) {
            newInv[i] = null;
            removed++;
          }
        }
        
        // If we couldn't remove all from inventory, remove from hotbar
        if (removed < ing.count) {
          const remaining = ing.count - removed;
          setHotbar(prevHotbar => {
            const newHotbar = [...prevHotbar];
            let hotbarRemoved = 0;
            
            for (let i = 0; i < 9 && hotbarRemoved < remaining; i++) {
              if (newHotbar[i] === ing.item) {
                newHotbar[i] = null;
                hotbarRemoved++;
              }
            }
            
            hotbarRef.current = newHotbar;
            return newHotbar;
          });
        }
      });
      
      inventoryRef.current = newInv;
      return newInv;
    });
    
    // Add result
    const resultData = ITEM_TYPES[recipe.result.item];
    if (resultData?.durability) {
      setToolDurability(prev => ({ ...prev, [recipe.result.item]: resultData.durability! }));
    }
    
    // Add result items
    setInventory(prev => {
      const newInv = [...prev];
      let added = 0;
      
      for (let i = 0; i < 27 && added < recipe.result.count; i++) {
        if (!newInv[i]) {
          newInv[i] = recipe.result.item;
          added++;
        }
      }
      
      inventoryRef.current = newInv;
      
      // If we couldn't add all to inventory, add to hotbar
      if (added < recipe.result.count) {
        const remaining = recipe.result.count - added;
        setHotbar(prevHotbar => {
          const newHotbar = [...prevHotbar];
          let hotbarAdded = 0;
          
          for (let i = 0; i < 9 && hotbarAdded < remaining; i++) {
            if (!newHotbar[i]) {
              newHotbar[i] = recipe.result.item;
              hotbarAdded++;
            }
          }
          
          hotbarRef.current = newHotbar;
          return newHotbar;
        });
      }
      
      return newInv;
    });
    
    showNotif(`🔨 Создано: ${recipe.name} x${recipe.result.count}`);
  }, [showNotif]);

  const handlePortalActivated = useCallback(() => {
    if (!portalActivated && countItem('portal_key') > 0) {
      setPortalActivated(true);
      setGameState('victory');
    }
  }, [portalActivated, countItem]);

  const handleRestart = () => {
    setGameState('start');
    setCrystalsCollected(0); setCurrentQuestion(null); setAnsweredIds([]); setCorrectAnswers(0);
    setCurrentSubject(null); setAvailableCrystals(Array.from({ length: 20 }, (_, i) => i));
    setHotbar(['wood_pickaxe', null, null, null, null, null, null, null, null]);
    setInventory(['oak_log_item', 'oak_log_item', 'oak_log_item', 'oak_log_item', 'oak_log_item', ...Array(22).fill(null)]);
    setSelectedSlot(0); setDroppedCrystals([]); setPendingCrystalId(null);
    setToolDurability({ wood_pickaxe: TOOL_DURABILITY.wood }); subjectIndexRef.current = 0;
    setPortalActivated(false);
    setCrystalPositions([]);
  };

  // Keyboard handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) setSelectedSlot(num - 1);
      if (e.key === 'e' || e.key === 'E' || e.key === 'у' || e.key === 'У') {
        setShowInventory(prev => !prev);
        if (document.pointerLockElement) document.exitPointerLock();
      }
      if (e.key === 'Escape') setShowInventory(false);
    };
    const handleWheel = (e: WheelEvent) => {
      if (gameState !== 'playing') return;
      if (e.deltaY > 0) setSelectedSlot(prev => (prev + 1) % 9);
      else setSelectedSlot(prev => (prev - 1 + 9) % 9);
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('wheel', handleWheel);
    return () => { document.removeEventListener('keydown', handleKey); document.removeEventListener('wheel', handleWheel); };
  }, [gameState]);

  // Inventory slot click handler
  const handleSlotClick = (item: string | null, index: number, from: 'hotbar' | 'inventory') => {
    if (!item) {
      if (dragItem) {
        if (from === 'hotbar') {
          const newHotbar = [...hotbar];
          newHotbar[index] = dragItem.item;
          if (dragItem.from === 'hotbar') newHotbar[dragItem.index] = null;
          else { const newInv = [...inventory]; newInv[dragItem.index] = null; setInventory(newInv); }
          setHotbar(newHotbar);
        } else {
          const newInventory = [...inventory];
          newInventory[index] = dragItem.item;
          if (dragItem.from === 'hotbar') { const newHotbar = [...hotbar]; newHotbar[dragItem.index] = null; setHotbar(newHotbar); }
          else newInventory[dragItem.index] = null;
          setInventory(newInventory);
        }
        setDragItem(null);
      }
    } else {
      if (dragItem) {
        // Swap
        if (dragItem.from === 'hotbar' && from === 'hotbar') {
          const newHotbar = [...hotbar]; newHotbar[dragItem.index] = item; newHotbar[index] = dragItem.item; setHotbar(newHotbar);
        } else if (dragItem.from === 'inventory' && from === 'inventory') {
          const newInv = [...inventory]; newInv[dragItem.index] = item; newInv[index] = dragItem.item; setInventory(newInv);
        } else if (dragItem.from === 'hotbar' && from === 'inventory') {
          const newHotbar = [...hotbar]; newHotbar[dragItem.index] = item; setHotbar(newHotbar);
          const newInv = [...inventory]; newInv[index] = dragItem.item; setInventory(newInv);
        } else {
          const newInv = [...inventory]; newInv[dragItem.index] = item; setInventory(newInv);
          const newHotbar = [...hotbar]; newHotbar[index] = dragItem.item; setHotbar(newHotbar);
        }
        setDragItem(null);
      } else {
        setDragItem({ item, from, index });
      }
    }
  };

  // Drag and drop handlers
  const handleDragStart = (item: string, index: number, from: 'hotbar' | 'inventory') => {
    setDragItem({ item, from, index });
  };

  const handleDragOver = (e: React.DragEvent, index: number, from: 'hotbar' | 'inventory') => {
    e.preventDefault();
    setDragOverSlot({ from, index });
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, index: number, from: 'hotbar' | 'inventory') => {
    e.preventDefault();
    setDragOverSlot(null);
    
    if (!dragItem) return;
    
    const targetItem = from === 'hotbar' ? hotbar[index] : inventory[index];
    
    if (!targetItem) {
      // Empty slot - move item here
      if (from === 'hotbar') {
        const newHotbar = [...hotbar];
        newHotbar[index] = dragItem.item;
        
        if (dragItem.from === 'hotbar') {
          newHotbar[dragItem.index] = null;
        } else {
          const newInventory = [...inventory];
          newInventory[dragItem.index] = null;
          setInventory(newInventory);
        }
        setHotbar(newHotbar);
      } else {
        const newInventory = [...inventory];
        newInventory[index] = dragItem.item;
        
        if (dragItem.from === 'hotbar') {
          const newHotbar = [...hotbar];
          newHotbar[dragItem.index] = null;
          setHotbar(newHotbar);
        } else {
          newInventory[dragItem.index] = null;
        }
        setInventory(newInventory);
      }
    } else {
      // Occupied slot - swap items
      if (dragItem.from === 'hotbar' && from === 'hotbar') {
        const newHotbar = [...hotbar];
        newHotbar[dragItem.index] = targetItem;
        newHotbar[index] = dragItem.item;
        setHotbar(newHotbar);
      } else if (dragItem.from === 'inventory' && from === 'inventory') {
        const newInventory = [...inventory];
        newInventory[dragItem.index] = targetItem;
        newInventory[index] = dragItem.item;
        setInventory(newInventory);
      } else if (dragItem.from === 'hotbar' && from === 'inventory') {
        const newHotbar = [...hotbar];
        newHotbar[dragItem.index] = targetItem;
        setHotbar(newHotbar);
        const newInventory = [...inventory];
        newInventory[index] = dragItem.item;
        setInventory(newInventory);
      } else {
        const newInventory = [...inventory];
        newInventory[dragItem.index] = targetItem;
        setInventory(newInventory);
        const newHotbar = [...hotbar];
        newHotbar[index] = dragItem.item;
        setHotbar(newHotbar);
      }
    }
    
    setDragItem(null);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      {gameState === 'start' && <StartScreen onStart={handleStart} />}

      {(gameState === 'playing' || gameState === 'question') && (
        <>
          <GameWorld
            onCrystalFound={() => {}}
            playerPosition={playerPosition}
            availableCrystals={availableCrystals}
            onBlockMined={handleBlockMined}
            selectedSlot={selectedSlot}
            hotbar={hotbar}
            onPlaceBlock={handlePlaceBlock}
            onCrystalPickup={handleCrystalPickup}
            droppedCrystals={droppedCrystals}
            onPortalActivated={handlePortalActivated}
            hasPortalKey={countItem('portal_key') > 0}
          />

          {/* HUD */}
          <div className="fixed inset-0 pointer-events-none z-40">
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
              <div className="pointer-events-auto bg-gray-900/90 backdrop-blur-sm border border-purple-500/50 rounded-xl px-4 py-2 flex items-center gap-3">
                <div className="text-2xl animate-pulse">💎</div>
                <div>
                  <div className="text-purple-300 text-xs font-medium">Кристаллы</div>
                  <div className="text-white font-bold text-lg">{crystalsCollected} / 20</div>
                </div>
              </div>
              <div className="pointer-events-auto bg-gray-900/90 backdrop-blur-sm border border-blue-500/50 rounded-xl px-4 py-2">
                <div className="flex items-center gap-4">
                  <div className="text-center"><div className="text-blue-300 text-xs">Вопросы</div><div className="text-white font-bold">{answeredIds.length}/100</div></div>
                  <div className="w-px h-8 bg-gray-600" />
                  <div className="text-center"><div className="text-green-300 text-xs">Верно</div><div className="text-white font-bold">{correctAnswers}</div></div>
                  <div className="w-px h-8 bg-gray-600" />
                  <div className="text-center"><div className="text-yellow-300 text-xs">Точность</div><div className="text-white font-bold">{answeredIds.length > 0 ? Math.round((correctAnswers / answeredIds.length) * 100) : 0}%</div></div>
                </div>
              </div>
            </div>


            {/* Portal objective */}
            <div className="absolute top-20 right-4 pointer-events-auto">
              <div className="bg-gray-900/90 backdrop-blur-sm border border-purple-500/50 rounded-xl px-4 py-2">
                <div className="text-purple-300 text-xs font-bold mb-1">🎯 Цель:</div>
                <div className="text-white text-xs">
                  {countItem('portal_key') > 0 
                    ? '🌀 Найди портал!' 
                    : `💎 ${crystalsCollected}/20 кристаллов`}
                </div>
                {countItem('portal_key') === 0 && (
                  <div className="text-gray-400 text-[10px] mt-1">
                    Собери 20💎 + 5💎 для ключа
                  </div>
                )}
              </div>
            </div>

            {/* Notifications */}
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

            {/* Hotbar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
              <div className="flex gap-1 bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl p-2">
                {hotbar.map((item, i) => {
                  const itemData = item ? ITEM_TYPES[item] : null;
                  const durability = item && toolDurability[item] !== undefined ? toolDurability[item] : null;
                  const maxDurability = item && ITEM_TYPES[item]?.durability ? ITEM_TYPES[item].durability! : null;
                  return (
                    <div key={i} className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center relative transition-all ${i === selectedSlot ? 'border-amber-400 bg-amber-900/30 scale-110 shadow-lg shadow-amber-500/30' : 'border-gray-600/50 bg-gray-800/50'}`}>
                      {itemData && item && <ItemIcon itemId={item} size={32} />}
                      <span className="absolute -top-1 -left-1 text-[10px] text-gray-400 font-bold bg-gray-900 rounded px-0.5">{i + 1}</span>
                      {durability !== null && maxDurability !== null && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b">
                          <div className={`h-full rounded-b ${durability / maxDurability > 0.5 ? 'bg-green-500' : durability / maxDurability > 0.25 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${(durability / maxDurability) * 100}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-center">
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-lg px-3 py-1 inline-block">
                  {hotbar[selectedSlot] ? (
                    <span className="text-amber-400 text-xs font-bold">⛏️ {ITEM_TYPES[hotbar[selectedSlot]!].name}</span>
                  ) : (
                    <span className="text-gray-400 text-xs">✋ Рука</span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-20 left-4 pointer-events-auto">
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-3 py-2">
                <div className="text-gray-300 text-[10px] space-y-0.5">
                  <div><span className="text-white font-bold">WASD</span> — ходить</div>
                  <div><span className="text-white font-bold">ЛКМ</span> — копать</div>
                  <div><span className="text-white font-bold">ПКМ</span> — ставить</div>
                  <div><span className="text-white font-bold">E</span> — инвентарь</div>
                  <div><span className="text-white font-bold">1-9</span> — слоты</div>
                </div>
              </div>
            </div>

            {/* Crosshair */}
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

          {/* Inventory */}
          {showInventory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)' }}>
              <div className="bg-gray-900 border-2 border-gray-600 rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">🎒 Инвентарь</h2>
                  <button onClick={() => setShowInventory(false)} className="text-gray-400 hover:text-white text-2xl font-bold px-3 py-1 rounded-lg hover:bg-gray-700">✕</button>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-4">
                  <p className="text-blue-300 text-sm">💡 Кликни предмет чтобы взять, затем на слот чтобы положить</p>
                </div>

                {/* Hotbar */}
                <div className="mb-4">
                  <h3 className="text-amber-400 font-bold mb-2 text-sm">⚡ Быстрый доступ (1-9)</h3>
                  <div className="flex gap-2 flex-wrap">
                    {hotbar.map((item, i) => {
                      const itemData = item ? ITEM_TYPES[item] : null;
                      const isSelected = dragItem && dragItem.item === item && dragItem.from === 'hotbar' && dragItem.index === i;
                      const isDragOver = dragOverSlot && dragOverSlot.from === 'hotbar' && dragOverSlot.index === i;
                      return (
                        <div key={i} 
                          onClick={() => handleSlotClick(item, i, 'hotbar')}
                          draggable={!!item}
                          onDragStart={() => item && handleDragStart(item, i, 'hotbar')}
                          onDragOver={(e) => handleDragOver(e, i, 'hotbar')}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, i, 'hotbar')}
                          className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center relative cursor-pointer transition-all ${isSelected ? 'border-yellow-400 bg-yellow-900/30 scale-110' : isDragOver ? 'border-blue-400 bg-blue-900/30' : 'border-amber-500/50 bg-gray-800/80'} hover:border-white/50 hover:bg-gray-700/80 group`}
                          title={itemData ? `${itemData.name}\n${itemData.description}` : 'Пусто'}>
                          {itemData && item && <ItemIcon itemId={item} size={36} />}
                          {itemData && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              {itemData.name}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Main inventory */}
                <div className="mb-4">
                  <h3 className="text-gray-400 font-bold mb-2 text-sm">📦 Хранилище</h3>
                  <div className="flex gap-2 flex-wrap">
                    {inventory.map((item, i) => {
                      const itemData = item ? ITEM_TYPES[item] : null;
                      const isSelected = dragItem && dragItem.item === item && dragItem.from === 'inventory' && dragItem.index === i;
                      const isDragOver = dragOverSlot && dragOverSlot.from === 'inventory' && dragOverSlot.index === i;
                      return (
                        <div key={i} 
                          onClick={() => handleSlotClick(item, i, 'inventory')}
                          draggable={!!item}
                          onDragStart={() => item && handleDragStart(item, i, 'inventory')}
                          onDragOver={(e) => handleDragOver(e, i, 'inventory')}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, i, 'inventory')}
                          className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center relative cursor-pointer transition-all ${isSelected ? 'border-yellow-400 bg-yellow-900/30 scale-110' : isDragOver ? 'border-blue-400 bg-blue-900/30' : 'border-gray-600/50 bg-gray-800/60'} hover:border-white/50 hover:bg-gray-700/80 group`}
                          title={itemData ? `${itemData.name}\n${itemData.description}` : 'Пусто'}>
                          {itemData && item && <ItemIcon itemId={item} size={36} />}
                          {itemData && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              {itemData.name}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Crafting */}
                <div>
                  <h3 className="text-amber-400 font-bold mb-2 text-sm">🔨 Крафт</h3>
                  
                  {/* Materials */}
                  <div className="mb-3">
                    <h4 className="text-gray-300 font-bold mb-2 text-xs">📦 Материалы</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {CRAFT_RECIPES.filter(r => r.category === 'materials').map(recipe => {
                        const getItemCount = (itemId: string) => 
                          hotbarRef.current.filter(item => item === itemId).length +
                          inventoryRef.current.filter(item => item === itemId).length;
                        
                        const craftable = recipe.ingredients.every(ing => getItemCount(ing.item) >= ing.count);
                        const missingItems = recipe.ingredients
                          .filter(ing => getItemCount(ing.item) < ing.count)
                          .map(ing => `${ITEM_TYPES[ing.item]?.name || ing.item}: ${ing.count - getItemCount(ing.item)}`)
                          .join(', ');
                        const tooltip = craftable ? 'Можно скрафтить!' : `Не хватает: ${missingItems || 'верстака'}`;
                        
                        return (
                          <div key={recipe.id} className={`rounded-lg p-2 border ${craftable ? 'border-green-500/50 bg-green-900/20 cursor-pointer hover:bg-green-900/30' : 'border-gray-600/30 bg-gray-800/30 opacity-60'}`} onClick={() => craftable && handleCraft(recipe.id)} title={tooltip}>
                            <div className="flex items-center gap-2">
                              <ItemIcon itemId={recipe.result.item} size={32} />
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-bold text-xs truncate">{recipe.name}</div>
                                <div className="text-gray-400 text-[10px] truncate">{recipe.description}</div>
                              </div>
                              {craftable && <div className="text-green-400 text-xs font-bold">✓</div>}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {recipe.ingredients.map((ing, i) => {
                                const itemCount = getItemCount(ing.item);
                                const hasEnough = itemCount >= ing.count;
                                const itemName = ITEM_TYPES[ing.item]?.name || ing.item;
                                const itemTooltip = hasEnough ? `${itemName}: достаточно` : `${itemName}: нужно ещё ${ing.count - itemCount}`;
                                return (
                                  <div key={i} className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] ${hasEnough ? 'bg-green-800/30 text-green-300' : 'bg-red-800/30 text-red-300'}`} title={itemTooltip}>
                                    <ItemIcon itemId={ing.item} size={12} />
                                    <span>{itemCount}/{ing.count}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Tools */}
                  <div className="mb-3">
                    <h4 className="text-gray-300 font-bold mb-2 text-xs">⛏️ Инструменты</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {CRAFT_RECIPES.filter(r => r.category === 'tools').map(recipe => {
                        const getItemCount = (itemId: string) => 
                          hotbarRef.current.filter(item => item === itemId).length +
                          inventoryRef.current.filter(item => item === itemId).length;
                        
                        const craftable = recipe.ingredients.every(ing => getItemCount(ing.item) >= ing.count);
                        const needsWorkbench = recipe.requiresWorkbench && getItemCount('crafting_table') === 0;
                        const missingItems = recipe.ingredients
                          .filter(ing => getItemCount(ing.item) < ing.count)
                          .map(ing => `${ITEM_TYPES[ing.item]?.name || ing.item}: ${ing.count - getItemCount(ing.item)}`)
                          .join(', ');
                        let tooltip = 'Можно скрафтить!';
                        if (!craftable) {
                          tooltip = `Не хватает: ${missingItems || 'материалов'}`;
                        }
                        if (needsWorkbench) {
                          tooltip = 'Нужен верстак!';
                        }
                        
                        return (
                          <div key={recipe.id} className={`rounded-lg p-2 border ${craftable && !needsWorkbench ? 'border-green-500/50 bg-green-900/20 cursor-pointer hover:bg-green-900/30' : 'border-gray-600/30 bg-gray-800/30 opacity-60'}`} onClick={() => craftable && !needsWorkbench && handleCraft(recipe.id)} title={tooltip}>
                            <div className="flex items-center gap-2">
                              <ItemIcon itemId={recipe.result.item} size={32} />
                              <div className="flex-1 min-w-0">
                              <div className="text-white font-bold text-xs truncate">{recipe.name}</div>
                              <div className="text-gray-400 text-[10px] truncate">{recipe.description}</div>
                              {recipe.requiresWorkbench && <div className="text-orange-400 text-[10px]">🔨 Верстак</div>}
                              {recipe.requiresQuestion && <div className="text-yellow-400 text-[10px]">⚠️ Вопрос</div>}                              </div>
                              {craftable && !needsWorkbench && <div className="text-green-400 text-xs font-bold">✓</div>}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {recipe.ingredients.map((ing, i) => {
                                const itemCount = getItemCount(ing.item);
                                const hasEnough = itemCount >= ing.count;
                                const itemName = ITEM_TYPES[ing.item]?.name || ing.item;
                                const itemTooltip = hasEnough ? `${itemName}: достаточно` : `${itemName}: нужно ещё ${ing.count - itemCount}`;
                                return (
                                  <div key={i} className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] ${hasEnough ? 'bg-green-800/30 text-green-300' : 'bg-red-800/30 text-red-300'}`} title={itemTooltip}>
                                    <ItemIcon itemId={ing.item} size={12} />
                                    <span>{itemCount}/{ing.count}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Building */}
                  <div className="mb-3">
                    <h4 className="text-gray-300 font-bold mb-2 text-xs">🏗️ Строительство</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {CRAFT_RECIPES.filter(r => r.category === 'building').map(recipe => {
                        const getItemCount = (itemId: string) => 
                          hotbarRef.current.filter(item => item === itemId).length +
                          inventoryRef.current.filter(item => item === itemId).length;
                        
                        const craftable = recipe.ingredients.every(ing => getItemCount(ing.item) >= ing.count);
                        const needsWorkbench = recipe.requiresWorkbench && getItemCount('crafting_table') === 0;
                        const missingItems = recipe.ingredients
                          .filter(ing => getItemCount(ing.item) < ing.count)
                          .map(ing => `${ITEM_TYPES[ing.item]?.name || ing.item}: ${ing.count - getItemCount(ing.item)}`)
                          .join(', ');
                        let tooltip = 'Можно скрафтить!';
                        if (!craftable) {
                          tooltip = `Не хватает: ${missingItems || 'материалов'}`;
                        }
                        if (needsWorkbench) {
                          tooltip = 'Нужен верстак!';
                        }
                        
                        return (
                          <div key={recipe.id} className={`rounded-lg p-2 border ${craftable && !needsWorkbench ? 'border-green-500/50 bg-green-900/20 cursor-pointer hover:bg-green-900/30' : 'border-gray-600/30 bg-gray-800/30 opacity-60'}`} onClick={() => craftable && !needsWorkbench && handleCraft(recipe.id)} title={tooltip}>
                            <div className="flex items-center gap-2">
                              <ItemIcon itemId={recipe.result.item} size={32} />
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-bold text-xs truncate">{recipe.name}</div>
                                <div className="text-gray-400 text-[10px] truncate">{recipe.description}</div>
                              </div>
                              {craftable && !needsWorkbench && <div className="text-green-400 text-xs font-bold">✓</div>}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {recipe.ingredients.map((ing, i) => {
                                const itemCount = getItemCount(ing.item);
                                const hasEnough = itemCount >= ing.count;
                                const itemName = ITEM_TYPES[ing.item]?.name || ing.item;
                                const itemTooltip = hasEnough ? `${itemName}: достаточно` : `${itemName}: нужно ещё ${ing.count - itemCount}`;
                                return (
                                  <div key={i} className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] ${hasEnough ? 'bg-green-800/30 text-green-300' : 'bg-red-800/30 text-red-300'}`} title={itemTooltip}>
                                    <ItemIcon itemId={ing.item} size={12} />
                                    <span>{itemCount}/{ing.count}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Special */}
                  {CRAFT_RECIPES.filter(r => r.category === 'special').length > 0 && (
                    <div>
                      <h4 className="text-gray-300 font-bold mb-2 text-xs">✨ Особое</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {CRAFT_RECIPES.filter(r => r.category === 'special').map(recipe => {
                          const getItemCount = (itemId: string) => 
                            hotbarRef.current.filter(item => item === itemId).length +
                            inventoryRef.current.filter(item => item === itemId).length;
                          
                          const craftable = recipe.ingredients.every(ing => getItemCount(ing.item) >= ing.count);
                          const needsWorkbench = recipe.requiresWorkbench && getItemCount('crafting_table') === 0;
                          const missingItems = recipe.ingredients
                            .filter(ing => getItemCount(ing.item) < ing.count)
                            .map(ing => `${ITEM_TYPES[ing.item]?.name || ing.item}: ${ing.count - getItemCount(ing.item)}`)
                            .join(', ');
                          let tooltip = 'Можно скрафтить!';
                          if (!craftable) {
                            tooltip = `Не хватает: ${missingItems || 'материалов'}`;
                          }
                          if (needsWorkbench) {
                            tooltip = 'Нужен верстак!';
                          }
                          
                          return (
                            <div key={recipe.id} className={`rounded-lg p-2 border ${craftable && !needsWorkbench ? 'border-purple-500/50 bg-purple-900/20 cursor-pointer hover:bg-purple-900/30' : 'border-gray-600/30 bg-gray-800/30 opacity-60'}`} onClick={() => craftable && !needsWorkbench && handleCraft(recipe.id)} title={tooltip}>
                              <div className="flex items-center gap-2">
                                <ItemIcon itemId={recipe.result.item} size={32} />
                                <div className="flex-1 min-w-0">
                                  <div className="text-white font-bold text-xs truncate">{recipe.name}</div>
                                  <div className="text-gray-400 text-[10px] truncate">{recipe.description}</div>
                                </div>
                                {craftable && !needsWorkbench && <div className="text-purple-400 text-xs font-bold">✓</div>}
                              </div>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {recipe.ingredients.map((ing, i) => {
                                  const itemCount = getItemCount(ing.item);
                                  const hasEnough = itemCount >= ing.count;
                                  const itemName = ITEM_TYPES[ing.item]?.name || ing.item;
                                  const itemTooltip = hasEnough ? `${itemName}: достаточно` : `${itemName}: нужно ещё ${ing.count - itemCount}`;
                                  return (
                                    <div key={i} className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] ${hasEnough ? 'bg-purple-800/30 text-purple-300' : 'bg-red-800/30 text-red-300'}`} title={itemTooltip}>
                                      <ItemIcon itemId={ing.item} size={12} />
                                      <span>{itemCount}/{ing.count}</span>
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
                </div>

                <div className="mt-4 pt-3 border-t border-gray-700 text-center text-gray-500 text-xs">
                  Нажмите <span className="text-white font-bold">E</span> чтобы закрыть
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {showCrystalChoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 border-2 border-purple-500 rounded-xl p-6 max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">💎 Кристалл подобран!</h2>
            <p className="text-gray-300 mb-6 text-center">Что хочешь сделать?</p>
            <div className="flex gap-4">
              <button
                onClick={handleAnswerNow}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                ✅ Ответить сейчас
              </button>
              <button
                onClick={handleAnswerLater}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                ⏰ Позже (60с)
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-4 text-center">
              Если не ответить за 60 секунд, кристалл разрушится!
            </p>
          </div>
        </div>
      )}

      {crystalTimer !== null && crystalTimer > 0 && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40">
          <div className={`px-4 py-2 rounded-lg font-bold ${crystalTimer <= 10 ? 'bg-red-600 animate-pulse' : 'bg-yellow-600'}`}>
            ⏰ Осталось: {crystalTimer}с
          </div>
          <button
            onClick={handleAnswerNow}
            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            📝 Ответить на вопрос
          </button>
        </div>
      )}

      {gameState === 'question' && currentQuestion && (
        <QuestionModal question={currentQuestion} onAnswer={handleAnswer} answeredIds={answeredIds} />
      )}

      {gameState === 'win' && (
        <WinScreen crystalsCollected={crystalsCollected} correctAnswers={correctAnswers} totalQuestions={answeredIds.length} onRestart={handleRestart} />
      )}

      {gameState === 'victory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a0033, #4a0080, #1a0033)' }}>
          <div className="text-center p-8 max-w-lg">
            <div className="text-8xl mb-6 animate-bounce">🌀</div>
            <h1 className="text-5xl font-bold text-white mb-4">ПОБЕДА!</h1>
            <p className="text-xl text-purple-200 mb-6">Ты активировал портал в новый мир!</p>
            <div className="bg-purple-900/50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center"><div className="text-3xl font-bold text-purple-400">{crystalsCollected}</div><div className="text-sm text-gray-400">Кристаллов</div></div>
                <div className="text-center"><div className="text-3xl font-bold text-green-400">{correctAnswers}</div><div className="text-sm text-gray-400">Правильных</div></div>
                <div className="text-center"><div className="text-3xl font-bold text-yellow-400">{answeredIds.length}</div><div className="text-sm text-gray-400">Вопросов</div></div>
              </div>
            </div>
            <button onClick={handleRestart} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold px-10 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all">
              🔄 Играть снова!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
