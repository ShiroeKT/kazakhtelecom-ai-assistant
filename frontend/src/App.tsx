import { useState, useEffect } from 'react';
import { Message, DiagnosticNode, ServiceCategory } from './types';
import { api } from './services/api';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { DiagnosticOptions } from './components/DiagnosticOptions';
import { CategorySelector } from './components/CategorySelector';
import { DiagnosisCard } from './components/DiagnosisCard';
import { RefreshCw, Sparkles } from 'lucide-react';

function App() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNode, setCurrentNode] = useState<DiagnosticNode | null>(null);
  const [currentCategory, setCurrentCategory] = useState<ServiceCategory | null>(null);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const session = await api.createSession();
      setSessionId(session.sessionId);
      
      const greeting = await api.generateResponse('greeting', {});
      setMessages([{
        role: 'assistant',
        content: greeting.response,
        timestamp: Date.now()
      }]);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const handleSendMessage = async (input: string) => {
    if (!sessionId || isLoading) return;

    setIsLoading(true);
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Analyze input
      const analysis = await api.analyzeInput(input, sessionId);
      
      if (analysis.detectedSymptoms.length > 0) {
        // Show category selector if symptoms detected
        const clarification = await api.generateResponse('clarification', {
          questions: analysis.clarifyingQuestions
        });
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: clarification.response,
          timestamp: Date.now(),
          type: 'clarification'
        }]);
        
        setShowCategorySelector(true);
        setCurrentCategory(analysis.suggestedCategory as ServiceCategory);
      } else {
        // No symptoms detected, ask for category
        const categoryResponse = await api.generateResponse('category', {});
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: categoryResponse.response,
          timestamp: Date.now()
        }]);
        setShowCategorySelector(true);
      }
    } catch (error) {
      console.error('Error analyzing input:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Произошла ошибка. Попробуйте еще раз.',
        timestamp: Date.now()
      }]);
    }

    setIsLoading(false);
  };

  const handleCategorySelect = async (category: ServiceCategory) => {
    if (!sessionId) return;

    setIsLoading(true);
    setShowCategorySelector(false);
    setCurrentCategory(category);

    try {
      const result = await api.startDiagnostic(category, sessionId);
      setCurrentNode(result.node);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.question,
        timestamp: Date.now(),
        type: 'question'
      }]);
    } catch (error) {
      console.error('Error starting diagnostic:', error);
    }

    setIsLoading(false);
  };

  const handleAnswerSelect = async (answerIndex: number) => {
    if (!currentNode || !currentCategory || !sessionId) return;

    setIsLoading(true);

    try {
      const result = await api.getNextNode(
        currentNode.id,
        answerIndex,
        currentCategory,
        sessionId
      );

      if (result.isTerminal && result.diagnosis) {
        setDiagnosis(result.diagnosis);
        setCurrentNode(null);
        
        const diagnosisText = await api.generateResponse('diagnosis', {
          diagnosis: result.diagnosis
        });
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: diagnosisText.response,
          timestamp: Date.now(),
          type: 'diagnosis'
        }]);
      } else if (result.node) {
        setCurrentNode(result.node);
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: result.question || '',
          timestamp: Date.now(),
          type: 'question'
        }]);
      }
    } catch (error) {
      console.error('Error getting next node:', error);
    }

    setIsLoading(false);
  };

  const handleReset = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setDiagnosis(null);
    setCurrentNode(null);
    setCurrentCategory(null);
    setShowCategorySelector(false);

    try {
      await api.resetDiagnostic(sessionId);
      await initializeSession();
    } catch (error) {
      console.error('Error resetting:', error);
    }

    setIsLoading(false);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">AI Ассистент</h1>
                <p className="text-sm text-gray-500">Техническая поддержка Казахтелеком</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Начать заново"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white border-x border-gray-200 overflow-hidden flex flex-col">
          <MessageList messages={messages} />
          
          {showCategorySelector && currentCategory && (
            <div className="p-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Выберите категорию услуги:</p>
              <CategorySelector
                onSelect={handleCategorySelect}
                disabled={isLoading}
              />
            </div>
          )}
          
          {currentNode && !diagnosis && (
            <div className="p-4 border-t border-gray-200">
              <DiagnosticOptions
                answers={currentNode.answers}
                onSelect={handleAnswerSelect}
                disabled={isLoading}
              />
            </div>
          )}
          
          {diagnosis && (
            <div className="p-4 border-t border-gray-200">
              <DiagnosisCard diagnosis={diagnosis} onReset={handleReset} />
            </div>
          )}
        </div>

        {/* Input */}
        {!diagnosis && !showCategorySelector && (
          <ChatInput
            onSend={handleSendMessage}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
}

export default App;
