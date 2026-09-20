import { useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import GameWorld from './components/GameWorld';
import QuestionModal from './components/QuestionModal';
import HUD from './components/HUD';
import StartScreen from './components/StartScreen';
import WinScreen from './components/WinScreen';
import { questions, subjects, Question } from './data/questions';

type GameState = 'start' | 'playing' | 'question' | 'win';

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [crystalsCollected, setCrystalsCollected] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredIds, setAnsweredIds] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [availableCrystals, setAvailableCrystals] = useState<number[]>(Array.from({ length: 20 }, (_, i) => i));
  const playerPosition = useRef(new THREE.Vector3(0, 3, 0));
  const subjectIndexRef = useRef(0);

  const totalCrystals = 20;

  const getNextQuestion = useCallback((): Question | null => {
    // Get unanswered questions
    const unanswered = questions.filter(q => !answeredIds.includes(q.id));
    if (unanswered.length === 0) return null;
    
    // Cycle through subjects
    const currentSubjectName = subjects[subjectIndexRef.current % subjects.length].name;
    const subjectQuestions = unanswered.filter(q => q.subject === currentSubjectName);
    
    if (subjectQuestions.length > 0) {
      return subjectQuestions[Math.floor(Math.random() * subjectQuestions.length)];
    }
    
    // If no questions for current subject, pick any unanswered
    subjectIndexRef.current++;
    const remaining = questions.filter(q => !answeredIds.includes(q.id));
    if (remaining.length > 0) {
      return remaining[Math.floor(Math.random() * remaining.length)];
    }
    return null;
  }, [answeredIds]);

  const handleStart = () => {
    setGameState('playing');
    // Show first subject hint
    setCurrentSubject(subjects[0].name);
  };

  const lastCrystalRef = useRef<number>(-1);

  const handleCrystalCollected = useCallback((crystalId: number) => {
    // Temporarily hide crystal while showing question
    setAvailableCrystals(prev => prev.filter(id => id !== crystalId));
    lastCrystalRef.current = crystalId;
    
    // Cycle through subjects based on crystal collected
    const subjectIdx = (crystalsCollected + 1) % subjects.length;
    setCurrentSubject(subjects[subjectIdx].name);
    
    // Show question for the current subject
    setTimeout(() => {
      const question = getNextQuestion();
      if (question) {
        setCurrentQuestion(question);
        setGameState('question');
      }
    }, 500);
  }, [getNextQuestion, crystalsCollected]);

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
        setCrystalsCollected(prev => prev + 1);
      } else {
        // Return crystal if answer was wrong
        if (lastCrystalRef.current >= 0) {
          setAvailableCrystals(prev => [...prev, lastCrystalRef.current]);
        }
      }
    }
    setCurrentQuestion(null);
    lastCrystalRef.current = -1;
    
    // Check if all questions answered
    const totalAnswered = answeredIds.length + 1;
    if (totalAnswered >= 100) {
      setGameState('win');
    } else {
      setGameState('playing');
      // Move to next subject
      subjectIndexRef.current = (subjectIndexRef.current + 1) % subjects.length;
      setCurrentSubject(subjects[subjectIndexRef.current].name);
    }
  };

  const handleRestart = () => {
    setGameState('start');
    setCrystalsCollected(0);
    setCurrentQuestion(null);
    setAnsweredIds([]);
    setCorrectAnswers(0);
    setCurrentSubject(null);
    setAvailableCrystals(Array.from({ length: 20 }, (_, i) => i));
    subjectIndexRef.current = 0;
  };

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
          />
          <HUD
            crystalsCollected={crystalsCollected}
            totalCrystals={totalCrystals}
            questionsAnswered={answeredIds.length}
            correctAnswers={correctAnswers}
            currentSubject={currentSubject}
            onStartQuestion={handleStartQuestion}
          />
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
