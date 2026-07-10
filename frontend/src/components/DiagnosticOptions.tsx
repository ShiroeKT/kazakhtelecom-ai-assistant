import { Answer } from '../types';
import { cn } from '../utils/cn';

interface DiagnosticOptionsProps {
  answers: Answer[];
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export function DiagnosticOptions({ answers, onSelect, disabled }: DiagnosticOptionsProps) {
  return (
    <div className="space-y-2 mt-4">
      {answers.map((answer, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          disabled={disabled}
          className={cn(
            'w-full text-left px-4 py-3 rounded-lg border-2',
            'transition-all duration-200',
            'border-gray-200 hover:border-blue-500 hover:bg-blue-50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center gap-3'
          )}
        >
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
            {index + 1}
          </span>
          <span className="text-gray-800">{answer.text}</span>
        </button>
      ))}
    </div>
  );
}
