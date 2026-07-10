import { Message } from '../types';
import { cn } from '../utils/cn';
import { Bot, User, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const getMessageIcon = (message: Message) => {
    if (message.role === 'assistant') {
      switch (message.type) {
        case 'diagnosis':
          return <CheckCircle className="w-5 h-5 text-green-600" />;
        case 'question':
          return <Info className="w-5 h-5 text-blue-600" />;
        default:
          return <Bot className="w-5 h-5 text-blue-600" />;
      }
    }
    return <User className="w-5 h-5 text-gray-600" />;
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="space-y-4 flex-1 overflow-y-auto p-4">
      {messages.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Начните диалог, описав вашу проблему</p>
        </div>
      )}
      
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            'flex gap-3',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              {getMessageIcon(message)}
            </div>
          )}
          
          <div
            className={cn(
              'max-w-[80%] rounded-2xl p-4',
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 shadow-sm'
            )}
          >
            <div
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
            />
            <div
              className={cn(
                'text-xs mt-2',
                message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
              )}
            >
              {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          
          {message.role === 'user' && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
