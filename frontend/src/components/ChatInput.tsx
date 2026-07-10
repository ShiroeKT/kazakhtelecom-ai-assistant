import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = 'Опишите вашу проблему...' }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled || isSending) return;

    setIsSending(true);
    await onSend(input);
    setInput('');
    setIsSending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isSending}
          className={cn(
            'flex-1 px-4 py-3 border border-gray-300 rounded-lg',
            'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'outline-none disabled:bg-gray-100 disabled:cursor-not-allowed'
          )}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled || isSending}
          className={cn(
            'px-6 py-3 rounded-lg font-medium transition-colors',
            'bg-blue-600 text-white hover:bg-blue-700',
            'disabled:bg-gray-300 disabled:cursor-not-allowed',
            'flex items-center gap-2'
          )}
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          <span>Отправить</span>
        </button>
      </div>
    </form>
  );
}
