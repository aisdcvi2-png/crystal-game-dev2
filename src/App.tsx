import { useState, useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import GameWorld from './components/GameWorld';
import QuestionModal from './components/QuestionModal';
import HUD from './components/HUD';
import Inventory from './components/Inventory';
import StartScreen from './components/StartScreen';
import WinScreen from './components/WinScreen';
import { questions, subjects, Question } from './data/questions';
import { BLOCK_TYPES, ITEM_TYPES, CRAFT_RECIPES } from './data/gameData';

type GameState = 'start' | 'playing' | 'question' | 'win';

interface DroppedCrystal {
  id: number;
  x: number;
  y: number;
  z: number;
}

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [crystalsCollected, setCrystalsCollected] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredIds, setAnsweredIds] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [availableCrystals, setAvailableCrystals] = useState<number[]>(Array.from({ length: 20 }, (_, i) => i));
  const [breakProgress, setBreakProgress] = useState<{ progress: number; max: number; blockName: string } | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [crystalNotification, setCrystalNotification] = useState<string | null>(null);
  
  // Inventory
  const [hotbar, setHotbar] = useState<(string | null)[]>(['wood_pickaxe', null, null, null, null, null, null, null, null]);
  const [inventory, setInventory] = useState<(string | null)[]>(['oak_log_item', 'oak_log_item', 'oak_log_item', ...Array(24).fill(null)]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  
  // Dropped crystals in world
  const [droppedCrystals, setDroppedCrystals] = useState<DroppedCrystal[]>([]);
  const [pendingCrystalId, setPendingCrystalId] = useState<number | null>(null);
  
  const playerPosition = useRef(new THREE.Vector3(0, 3, 0));
  const subjectIndexRef = useRef(0);
  const notifTimeoutRef = useRef<any>(null);

  const totalCrystals = 20;

  const showNotif = useCallback((msg: string) => {
    setNotification(msg);
    if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
    notifTimeoutRef.current = setTimeout(() => setNotification(null), 2500);
  }, []);

  // Auto-release mouse when question is shown
  useEffect(() => {
    if (gameState === 'question') {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    }
  }, [gameState]);

  // Add item to inventory
  const addItem = useCallback((itemId: string, count: number = 1) => {
    const itemData = ITEM_TYPES[itemId];
    if (!itemData) return;

    for (let c = 0; c < count; c++) {
      setInventory(prev => {
        const newInv = [...prev];
        // Find empty slot
        for (let i = 0; i < 27; i++) {
          if (!newInv[i]) {
            newInv[i] = itemId;
            return newInv;
          }
        }
        // Try hotbar
        setHotbar(prevHotbar => {
          const newHotbar = [...prevHotbar];
          for (let i = 0; i < 9; i++) {
            if (!newHotbar[i]) {
              newHotbar[i] = itemId;
              return newHotbar;
            }
          }
          return prevHotbar;
        });
        return prev;
      });
    }

    showNotif(`+${count} ${itemData.icon} ${itemData.name}`);
  }, [showNotif]);

  // Remove item from inventory
  const removeItem = useCallback((itemId: string, count: number = 1): boolean => {
    let removed = 0;
    
    // Remove from inventory first
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

    // If not enough, remove from hotbar
    setTimeout(() => {
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
    }, 0);

    return true;
  }, []);

  // Count item in inventory
  const countItem = useCallback((itemId: string): number => {
    let count = 0;
    hotbar.forEach(item => { if (item === itemId) count++; });
    inventory.forEach(item => { if (item === itemId) count++; });
    return count;
  }, [hotbar, inventory]);

  // Handle block mined - chance to drop crystal
  const handleBlockMined = useCallback((blockType: string, x: number, y: number, z: number) => {
    const blockData = BLOCK_TYPES[blockType];
    if (!blockData) return;

    // Process regular drops
    if (blockData.drops) {
      blockData.drops.forEach(drop => {
        if (Math.random() < drop.chance) {
          addItem(drop.item, drop.count);
        }
      });
    }

    // Process rare drops
    if (blockData.rareDrops) {
      blockData.rareDrops.forEach(drop => {
        if (Math.random() < drop.chance) {
          if (drop.item === 'crystal' && availableCrystals.length > 0) {
            // Drop crystal in world!
            const crystalId = availableCrystals[0];
            setAvailableCrystals(prev => prev.slice(1));
            setDroppedCrystals(prev => [...prev, { id: crystalId, x, y: y + 1, z }]);
            setCrystalNotification('💎 Откопан кристалл! Подойди чтобы подобрать!');
            setTimeout(() => setCrystalNotification(null), 3000);
          } else {
            addItem(drop.item, drop.count);
          }
        }
      });
    }
  }, [availableCrystals, addItem]);

  // Handle crystal pickup
  const handleCrystalPickup = useCallback((crystalId: number) => {
    // Remove from dropped crystals
    setDroppedCrystals(prev => prev.filter(c => c.id !== crystalId));
    setPendingCrystalId(crystalId);
    
    // Show notification
    setCrystalNotification('✨ Кристалл подобран! Ответь на вопрос!');
    setTimeout(() => setCrystalNotification(null), 2000);
    
    // Release mouse for question
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
    
    // Cycle subject
    subjectIndexRef.current = (subjectIndexRef.current + 1) % subjects.length;
    setCurrentSubject(subjects[subjectIndexRef.current].name);
    
    // Show question after delay
    setTimeout(() => {
      const question = getNextQuestion();
      if (question) {
        setCurrentQuestion(question);
        setGameState('question');
      }
    }, 500);
  }, []);

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
  };

  const handleStartQuestion = () => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
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
        
        // Rewards based on question number
        const qNum = currentQuestion.id;
        if (qNum % 10 === 0) {
          addItem('diamond', 2);
          addItem('gold_ingot', 3);
          showNotif('🏆 Превосходно! +2💎 +3🟡');
        } else if (qNum % 5 === 0) {
          addItem('iron_ingot', 2);
          addItem('coal', 3);
          showNotif('⭐ Отлично! +2⬜ +3⚫');
        } else {
          addItem('cobblestone', 3);
          addItem('stick', 2);
        }
        
        if (pendingCrystalId !== null) {
          setCrystalsCollected(prev => prev + 1);
          setPendingCrystalId(null);
        }
      } else {
        if (pendingCrystalId !== null) {
          setAvailableCrystals(prev => [...prev, pendingCrystalId]);
          setPendingCrystalId(null);
        }
        showNotif('❌ Неправильно!');
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

    removeItem(itemId, 1);
  }, [hotbar, selectedSlot, removeItem, showNotif]);

  const handleCraft = useCallback((recipeId: string) => {
    const recipe = CRAFT_RECIPES.find((r) => r.id === recipeId);
    if (!recipe) return;

    const hasAll = recipe.ingredients.every((ing) => countItem(ing.item) >= ing.count);
    if (!hasAll) {
      showNotif('Недостаточно материалов!');
      return;
    }

    recipe.ingredients.forEach((ing) => removeItem(ing.item, ing.count));
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
    setBreakProgress(null);
    setHotbar(['wood_pickaxe', null, null, null, null, null, null, null, null]);
    setInventory(['oak_log_item', 'oak_log_item', 'oak_log_item', ...Array(24).fill(null)]);
    setSelectedSlot(0);
    setDroppedCrystals([]);
    setPendingCrystalId(null);
    subjectIndexRef.current = 0;
  };

  // Keyboard handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        setSelectedSlot(num - 1);
      }
      
      if (e.key === 'e' || e.key === 'E' || e.key === 'у' || e.key === 'У') {
        setShowInventory(prev => !prev);
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      }
      
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
            onCrystalFound={() => {}}
            playerPosition={playerPosition}
            availableCrystals={availableCrystals}
            onBreakProgress={handleBreakProgress}
            onBlockMined={handleBlockMined}
            selectedSlot={selectedSlot}
            hotbar={hotbar}
            onPlaceBlock={handlePlaceBlock}
            onCrystalPickup={handleCrystalPickup}
            droppedCrystals={droppedCrystals}
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
            crystalNotification={crystalNotification}
          />
          
          {showInventory && (
            <Inventory
              hotbar={hotbar}
              inventory={inventory}
              setHotbar={setHotbar}
              setInventory={setInventory}
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
