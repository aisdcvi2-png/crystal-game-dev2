import { useState, useEffect } from 'react';
import { Question } from '../data/questions';

interface QuestionModalProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
}

export default function QuestionModal({ question, onAnswer }: QuestionModalProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    setTimeout(() => onAnswer(index === question.correct), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="bg-gray-900 border-2 border-purple-500 rounded-2xl p-6 max-w-lg w-full shadow-2xl shadow-purple-500/20">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">📝</span>
          <span className="text-white font-bold text-lg">{question.subject}</span>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <p className="text-white text-lg font-medium leading-relaxed">
            {question.question}
          </p>
          <div className="text-gray-400 text-sm mt-2">
            Вопрос #{question.id} из 100
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => {
            let btnClass = 'bg-gray-800 border-2 border-gray-600 hover:border-purple-400 hover:bg-gray-700 text-white';
            
            if (showResult) {
              if (index === question.correct) {
                btnClass = 'bg-green-600/30 border-2 border-green-400 text-green-300';
              } else if (index === selected && index !== question.correct) {
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
                className={`${btnClass} rounded-xl px-4 py-3 text-left font-medium transition-all duration-200`}
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

        {showResult && (
          <div className={`mt-4 p-3 rounded-xl text-center font-bold text-lg ${
            selected === question.correct ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {selected === question.correct ? '✅ Правильно! +1 кристалл' : '❌ Неправильно!'}
          </div>
        )}
      </div>
    </div>
  );
}
