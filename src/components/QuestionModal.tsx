import { useState, useEffect } from 'react';
import { Question, subjects } from '../data/questions';

interface QuestionModalProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  onClose: () => void;
  answeredIds: number[];
}

export default function QuestionModal({ question, onAnswer, onClose, answeredIds }: QuestionModalProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const subject = subjects.find(s => s.name === question.subject);

  useEffect(() => {
    if (showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCorrect(false);
          setShowResult(true);
          setTimeout(() => onAnswer(false), 1500);
          return 0;
        }
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
      <div className="bg-gray-900 border-2 border-purple-500 rounded-2xl p-6 max-w-lg w-full shadow-2xl shadow-purple-500/20 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
          }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{subject?.icon}</span>
            <span className="text-white font-bold text-lg">{question.subject}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${timeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-500/20 text-blue-300'}`}>
            ⏱ {timeLeft}с
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4 relative">
          <p className="text-white text-lg font-medium leading-relaxed">
            {question.question}
          </p>
          <div className="text-gray-400 text-sm mt-2">
            Вопрос #{question.id} из 100
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3 relative">
          {question.options.map((option, index) => {
            let btnClass = 'bg-gray-800 border-2 border-gray-600 hover:border-purple-400 hover:bg-gray-700 text-white';
            
            if (showResult) {
              if (index === question.correct) {
                btnClass = 'bg-green-600/30 border-2 border-green-400 text-green-300';
              } else if (index === selected && !isCorrect) {
                btnClass = 'bg-red-600/30 border-2 border-red-400 text-red-300';
              } else {
                btnClass = 'bg-gray-800/50 border-2 border-gray-700 text-gray-500';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showResult}
                className={`${btnClass} rounded-xl px-4 py-3 text-left font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-95`}
              >
                <span className="inline-flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Result */}
        {showResult && (
          <div className={`mt-4 p-3 rounded-xl text-center font-bold text-lg relative ${isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {isCorrect ? '✅ Правильно! +1 кристалл' : '❌ Неправильно! Попробуй ещё раз'}
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-4 relative">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Прогресс</span>
            <span>{answeredIds.length}/100</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
              style={{ width: `${(answeredIds.length / 100) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
