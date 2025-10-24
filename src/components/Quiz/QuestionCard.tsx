import React from 'react';
import type { Question, QuestionOption } from '../../types';

interface QuestionCardProps {
  question: Question;
  selectedValue?: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  showPrevious: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedValue,
  onSelect,
  onNext,
  onPrevious,
  showPrevious
}) => {
  const handleOptionClick = (value: string) => {
    onSelect(value);
  };

  const handleNext = () => {
    if (selectedValue) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option: QuestionOption) => (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all min-h-[60px] flex items-center gap-3 ${
              selectedValue === option.value
                ? 'border-primary bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-primary hover:shadow-sm'
            }`}
            aria-pressed={selectedValue === option.value}
            aria-label={`${option.emoji ? option.emoji + ' ' : ''}${option.label}`}
          >
            {option.emoji && (
              <span className="text-3xl" aria-hidden="true">
                {option.emoji}
              </span>
            )}
            <span className="text-lg font-medium text-text-primary flex-1">
              {option.label}
            </span>
            {selectedValue === option.value && (
              <span className="text-primary text-xl" aria-hidden="true">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        {showPrevious && (
          <button
            onClick={onPrevious}
            className="px-6 py-3 text-text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label="Question précédente"
          >
            ← Précédent
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!selectedValue}
          className={`ml-auto px-8 py-3 rounded-lg font-semibold transition-all ${
            selectedValue
              ? 'bg-primary text-white hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Question suivante"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
};
