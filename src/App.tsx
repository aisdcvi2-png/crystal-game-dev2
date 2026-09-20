import { useState, useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import GameWorld from './components/GameWorld';
import QuestionModal from './components/QuestionModal';
import HUD from './components/HUD';
import Inventory from './components/Inventory';
import StartScreen from './components/StartScreen';
import WinScreen from './components/WinScreen';
import { questions, subjects, Question } from './data/questions';
import { BLOCK_TYPES, ITEM_TYPES, CRAFT_RECIPES, generateWorld, getSurfaceHeight, WORLD_SIZE } from './data/gameData';

type GameState = 'start' | 'playing' | 'question' | 'win';

interface InventorySlot {
  item: string;
  count: number;
}

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [crystalsCollected, setCrystalsCollected] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredIds, setAnsweredIds] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [availableCrystals, setAvailableCrystals] = useState<number[]>(Array.from({ length: 20 }, (_, i) => i));
  const [pendingCrystal, setPendingCrystal] = useState<number | null>(null);
  const [breakProgress, setBreakProgress] = useState<{ progress: number; max: number; blockName: string } | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Inventory: hotbar (9 slots) + main inventory (27 slots)
  const [hotbar, setHotbar] = useState<(string | null)[]>([null, null, null, null, null, null, null, null, null]);
  const [inventory, setInventory] = useState<(string | null)[]>(Array(27).fill(null));
  const [selectedSlot, setSelectedSlot] = useState(0);
  
  const playerPosition = useRef(new THREE.Vector3(0, 3, 0));
  const subjectIndexRef = useRef(0);
  const notifTimeoutRef = useRef<any>(null);

  const totalCrystals = 20;

  const showNotif = useCallback((msg: string) => {
    setNotification(msg);
    if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
    notifTimeoutRef.current = setTimeout(() => setNotification(null), 2500);
  }, []);

  // Add item to inventory
  const addItem = useCallback((itemId: string, count: number = 1) => {
    const itemData = ITEM_TYPES[itemId];
    if (!itemData) return;

    // Try to stack in hotbar first
    setHotbar(prev => {
      const newHotbar = [...prev];
      let remaining = count;
      
      // Stack with existing
      for (let i = 0; i < 9 && remaining > 0; i++) {
        if (newHotbar[i] === itemId) {
          // Can't exceed stack size for tools
          const maxStack = itemData.stackSize;
          // We track counts separately, just mark slot as having this item
          remaining = 0;
        }
      }
      
      // Find empty slot
      if (remaining > 0) {
        for (let i = 0; i < 9 && remaining > 0; i++) {
          if (!newHotbar[i]) {
            newHotbar[i] = itemId;
            remaining = 0;
          }
        }
      }
      
      return newHotbar;
    });

    // Also add to main inventory tracking
    setInventory(prev => {
      const newInv = [...prev];
      let remaining = count;
      
      for (let i = 0; i < 27 && remaining > 0; i++) {
        if (!newInv[i]) {
          newInv[i] = itemId;
          remaining--;
        }
      }
      
      return newInv;
    });

    showNotif(`+${count} ${itemData.icon} ${itemData.name}`);
  }, [showNotif]);

  // Remove item from inventory
  const removeItem = useCallback((itemId: string, count: number = 1): boolean => {
    let removed = 0;
    
    setInventory(prev => {
      const newInv = [...prev];
      for (let i = 0; i < 27 && removed < count; i++) {
        if (newInv[i] === itemId) {
          newInv[i] = null;
          removed++;
        }
      }
      return newInv;
    });

    if (removed < count) {
      setHotbar(prev => {
        const newHotbar = [...prev];
        for (let i = 0; i < 9 && removed < count; i++) {
          if (newHotbar[i] === itemId) {
            newHotbar[i] = null;
            removed++;
          }
        }
        return newHotbar;
      });
    }

    return removed >= count;
  }, []);

  // Count item in inventory
  const countItem = useCallback((itemId: string): number => {
    let count = 0;
    hotbar.forEach(item => { if (item === itemId) count++; });
    inventory.forEach(item => { if (item === itemId) count++; });
    return count;
  }, [hotbar, inventory]);

  // Handle block mined
  const handleBlockMined = useCallback((blockType: string, x: number, y: number, z: number) => {
    const blockData = BLOCK_TYPES[blockType];
    if (!blockData) return;

    // Process drops
    if (blockData.drops) {
      blockData.drops.forEach(drop => {
        if (Math.random() < drop.chance) {
          addItem(drop.item, drop.count);
        }
      });
    }

    // Process rare drops (crystals!)
    if (blockData.rareDrops) {
      blockData.rareDrops.forEach(drop => {
        if (Math.random() < drop.chance) {
          if (drop.item === 'crystal') {
            // Crystal found! Trigger question
            const crystalIdx = availableCrystals[0];
            if (crystalIdx !== undefined) {
              setPendingCrystal(crystalIdx);
              setAvailableCrystals(prev => prev.slice(1));
              
              subjectIndexRef.current = (subjectIndexRef.current + 1) % subjects.length;
              setCurrentSubject(subjects[subjectIndexRef.current].name);
              
              setTimeout(() => {
                const question = getNextQuestion();
                if (question) {
                  setCurrentQuestion(question);
                  setGameState('question');
                }
              }, 500);
            }
          } else {
            addItem(drop.item, drop.count);
          }
        }
      });
    }
  }, [availableCrystals, addItem]);

  const getNextQuestion = useCallback((): Question | null => {
    const unanswered = questions.filter(q => !answeredIds.includes(q.id));
    if (unanswered.length === 0) return null;
    
    const currentSubjectName = subjects[subjectIndexRef.current % subjects.length].name;
    const subjectQuestions = unanswered.filter(q => q.subject === currentSubjectName);
    
    if (subjectQuestions.length > 0) {
      return subjectQuestions[Math.floor(Math.random() * subjectQuestions.length)];
    }
    
    subjectIndexRef.current++;
    const remaining = questions.filter(q => !answeredIds.includes(q.id));
    if (remaining.length > 0) {
      return remaining[Math.floor(Math.random() * remaining.length)];
    }
    return null;
  }, [answeredIds]);

  const handleStart = () => {
    setGameState('playing');
    setCurrentSubject(subjects[0].name);
    // Give starting items
    setHotbar(['wood_pickaxe', null, null, null, null, null, null, null, null]);
    setInventory(['oak_log_item', 'oak_log_item', 'oak_log_item', ...Array(24).fill(null)]);
  };

  const handleCrystalCollected = useCallback((crystalId: number) => {
    // This is called when crystal drops in world - handled in handleBlockMined now
  }, []);

  const handleStartQuestion = () => {
    const question = getNextQuestion();
    if (question) {
      setCurrentQuestion(question);
      setGameState('question');
    }
  };

  const handleAnswer = (correct: boolean) => {
    if (currentQuestion) {
      setAnsweredIds(prev => [...prev, currentQuestion.id]);
      if (correct) {
        setCorrectAnswers(prev => prev + 1);
        
        // Rewards based on difficulty
        const qNum = currentQuestion.id;
        if (qNum % 10 === 0) {
          // Every 10th question - big reward
          addItem('diamond', 2);
          addItem('gold_ingot', 3);
          showNotif('🏆 Отличный ответ! +2💎 +3🟡');
        } else if (qNum % 5 === 0) {
          addItem('iron_ingot', 2);
          addItem('coal', 3);
          showNotif('⭐ Хороший ответ! +2⬜ +3⚫');
        } else {
          addItem('cobblestone', 3);
          addItem('stick', 2);
        }
        
        if (pendingCrystal !== null) {
          setCrystalsCollected(prev => prev + 1);
          setPendingCrystal(null);
        }
      } else {
        if (pendingCrystal !== null) {
          setAvailableCrystals(prev => [...prev, pendingCrystal]);
          setPendingCrystal(null);
        }
        showNotif('❌ Неправильно! Кристалл потерян...');
      }
    }
    setCurrentQuestion(null);
    
    const totalAnswered = answeredIds.length + 1;
    if (totalAnswered >= 100) {
      setGameState('win');
    } else {
      setGameState('playing');
    }
  };

  const handleBreakProgress = useCallback((progress: number, maxHealth: number, blockName: string) => {
    if (progress === 0 || !blockName) {
      setBreakProgress(null);
    } else {
      setBreakProgress({ progress, max: maxHealth, blockName });
    }
  }, []);

  const handlePlaceBlock = useCallback((x: number, y: number, z: number) => {
    const itemId = hotbar[selectedSlot];
    if (!itemId) return;
    
    const itemData = ITEM_TYPES[itemId];
    if (!itemData?.placeable) {
      showNotif('Этот предмет нельзя поставить!');
      return;
    }

    // Remove from inventory
    removeItem(itemId, 1);
    showNotif(`Блок поставлен!`);
  }, [hotbar, selectedSlot, removeItem, showNotif]);

  const handleCraft = useCallback((recipeId: string) => {
    const recipe = CRAFT_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    // Check ingredients
    const hasAll = recipe.ingredients.every(ing => countItem(ing.item) >= ing.count);
    if (!hasAll) {
      showNotif('Недостаточно материалов!');
      return;
    }

    // Remove ingredients
    recipe.ingredients.forEach(ing => removeItem(ing.item, ing.count));
    
    // Add result
    addItem(recipe.result.item, recipe.result.count);
    showNotif(`🔨 Создано: ${recipe.name} x${recipe.result.count}`);
  }, [countItem, removeItem, addItem, showNotif]);

  const handleRestart = () => {
    setGameState('start');
    setCrystalsCollected(0);
    setCurrentQuestion(null);
    setAnsweredIds([]);
    setCorrectAnswers(0);
    setCurrentSubject(null);
    setAvailableCrystals(Array.from({ length: 20 }, (_, i) => i));
    setPendingCrystal(null);
    setBreakProgress(null);
    setHotbar(Array(9).fill(null));
    setInventory(Array(27).fill(null));
    setSelectedSlot(0);
    subjectIndexRef.current = 0;
  };

  // Keyboard handler for hotbar selection and inventory
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      // Number keys for hotbar
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        setSelectedSlot(num - 1);
      }
      
      // E for inventory
      if (e.key === 'e' || e.key === 'E' || e.key === 'у' || e.key === 'У') {
        setShowInventory(prev => !prev);
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      }
      
      // Escape to close inventory
      if (e.key === 'Escape') {
        setShowInventory(false);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (gameState !== 'playing') return;
      if (e.deltaY > 0) {
        setSelectedSlot(prev => (prev + 1) % 9);
      } else {
        setSelectedSlot(prev => (prev - 1 + 9) % 9);
      }
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('wheel', handleWheel);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [gameState]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      {gameState === 'start' && (
        <StartScreen onStart={handleStart} />
      )}

      {(gameState === 'playing' || gameState === 'question') && (
        <>
          <GameWorld
            crystalsCollected={crystalsCollected}
            totalCrystals={totalCrystals}
            onCrystalCollected={handleCrystalCollected}
            playerPosition={playerPosition}
            availableCrystals={availableCrystals}
            onBreakProgress={handleBreakProgress}
            onBlockMined={handleBlockMined}
            selectedSlot={selectedSlot}
            hotbar={hotbar}
            onPlaceBlock={handlePlaceBlock}
          />
          <HUD
            crystalsCollected={crystalsCollected}
            totalCrystals={totalCrystals}
            questionsAnswered={answeredIds.length}
            correctAnswers={correctAnswers}
            currentSubject={currentSubject}
            onStartQuestion={handleStartQuestion}
            breakProgress={breakProgress}
            hotbar={hotbar}
            selectedSlot={selectedSlot}
            notification={notification}
          />
          
          {showInventory && (
            <Inventory
              hotbar={hotbar}
              inventory={inventory}
              onCraft={handleCraft}
              onClose={() => setShowInventory(false)}
              countItem={countItem}
            />
          )}
        </>
      )}

      {gameState === 'question' && currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          onAnswer={handleAnswer}
          onClose={() => setGameState('playing')}
          answeredIds={answeredIds}
        />
      )}

      {gameState === 'win' && (
        <WinScreen
          crystalsCollected={crystalsCollected}
          correctAnswers={correctAnswers}
          totalQuestions={answeredIds.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
