import { Malfunction, ServiceCategory, Message } from '../types';

export class ResponseGenerator {
  generateGreeting(): string {
    const greetings = [
      'Здравствуйте! Я AI-ассистент технической поддержки Казахтелеком. Опишите вашу проблему, и я помогу её решить.',
      'Добрый день! Я помогу вам диагностировать и решить проблему с услугами Казахтелеком. Расскажите, что случилось?',
      'Приветствую! Я виртуальный помощник техподдержки. Опишите вашу проблему, и мы вместе её решим.'
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  generateClarification(questions: string[]): string {
    if (questions.length === 0) {
      return 'Пожалуйста, опишите вашу проблему подробнее.';
    }
    
    const intro = 'Чтобы точнее определить причину проблемы, ответьте на несколько вопросов:';
    const questionList = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    
    return `${intro}\n\n${questionList}`;
  }

  generateDiagnosticQuestion(question: string, answers: string[]): string {
    const answerList = answers.map((a, i) => `${i + 1}. ${a}`).join('\n');
    return `${question}\n\nВарианты ответа:\n${answerList}`;
  }

  generateDiagnosis(diagnosis: Malfunction): string {
    return `🔍 **Диагностика завершена**\n\n` +
           `**Проблема:** ${diagnosis.name}\n` +
           `**Описание:** ${diagnosis.description}\n` +
           `**Важность:** ${this.translateSeverity(diagnosis.severity)}\n\n` +
           `**Возможные причины:**\n${diagnosis.possibleCauses.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n` +
           `**Решения:**\n${this.formatSolutions(diagnosis.solutions)}\n\n` +
           `**Ориентировочное время решения:** ${diagnosis.estimatedResolutionTime}\n` +
           `${diagnosis.requiresTechnician ? '\n⚠️ Требуется выезд техника.' : ''}`;
  }

  generateSolutionStep(step: number, description: string, actionType: string): string {
    const actionEmoji = this.getActionEmoji(actionType);
    return `${actionEmoji} **Шаг ${step}:** ${description}`;
  }

  generateTechnicianInfo(): string {
    return '🔧 **Вызов техника**\n\n' +
           'Для решения проблемы требуется выезд специалиста.\n' +
           'Техник свяжется с вами для согласования времени визита.\n' +
           'Ориентировочное время ожидания: 24-48 часов.';
  }

  generateConfirmation(): string {
    const confirmations = [
      'Хорошо, продолжим диагностику.',
      'Понял, идем дальше.',
      'Принято, переходим к следующему шагу.'
    ];
    return confirmations[Math.floor(Math.random() * confirmations.length)];
  }

  generateError(message: string): string {
    return `❌ Произошла ошибка: ${message}\n\nПожалуйста, попробуйте еще раз или опишите проблему другими словами.`;
  }

  generateProgress(currentStep: number, totalSteps: number): string {
    const percentage = Math.round((currentStep / totalSteps) * 100);
    return `📊 Прогресс диагностики: ${percentage}% (${currentStep}/${totalSteps} шагов)`;
  }

  generateSubscriberText(diagnosis: Malfunction, subscriberName?: string): string {
    const greeting = subscriberName ? `Уважаемый(ая) ${subscriberName}!` : 'Уважаемый абонент!';
    
    return `${greeting}\n\n` +
           `По результатам диагностики выявлена следующая проблема:\n\n` +
           `**${diagnosis.name}**\n` +
           `${diagnosis.description}\n\n` +
           `Для решения проблемы выполните следующие действия:\n\n` +
           `${this.formatSolutions(diagnosis.solutions)}\n\n` +
           `Ориентировочное время решения: ${diagnosis.estimatedResolutionTime}\n\n` +
           `${diagnosis.requiresTechnician ? 
             'Если после выполнения действий проблема сохранится, будет вызван техник.' : 
             'После выполнения этих действий проблема должна быть решена.'}\n\n` +
           `Если у вас возникнут вопросы, обращайтесь в техническую поддержку Казахтелеком.`;
  }

  generateSummary(conversationHistory: Message[]): string {
    if (conversationHistory.length === 0) {
      return 'История разговора пуста.';
    }

    const userMessages = conversationHistory.filter(m => m.role === 'user');
    const assistantMessages = conversationHistory.filter(m => m.role === 'assistant');

    return `📋 **Сводка разговора**\n\n` +
           `**Всего сообщений:** ${conversationHistory.length}\n` +
           `**Сообщений абонента:** ${userMessages.length}\n` +
           `**Ответов ассистента:** ${assistantMessages.length}\n\n` +
           `**Последнее действие:** ${conversationHistory[conversationHistory.length - 1].content.substring(0, 100)}...`;
  }

  private translateSeverity(severity: string): string {
    const translations: Record<string, string> = {
      'low': 'Низкая',
      'medium': 'Средняя',
      'high': 'Высокая'
    };
    return translations[severity] || severity;
  }

  private formatSolutions(solutions: any[]): string {
    return solutions.map(s => 
      `${this.getActionEmoji(s.actionType)} **Шаг ${s.step}:** ${s.description}`
    ).join('\n');
  }

  private getActionEmoji(actionType: string): string {
    const emojis: Record<string, string> = {
      'instruction': '📝',
      'check': '✅',
      'reset': '🔄',
      'configuration': '⚙️'
    };
    return emojis[actionType] || '•';
  }

  generateCategorySelection(): string {
    return 'Выберите категорию услуги, с которой у вас проблема:\n\n' +
           '1. 🌐 Интернет\n' +
           '2. 📺 Телевидение\n' +
           '3. 📞 Телефония\n' +
           '4. 📱 Мобильная связь\n' +
           '5. 🔌 Оборудование';
  }

  generateRestartConfirmation(): string {
    return 'Хотите начать диагностику заново?';
  }

  generateGoodbye(): string {
    const goodbyes = [
      'Спасибо за обращение в техническую поддержку Казахтелеком! Если у вас возникнут вопросы - мы всегда на связи.',
      'До свидания! Надеюсь, проблема решена. Обращайтесь в любое время.',
      'Благодарим за использование услуг Казахтелеком! Желаем приятного пользования.'
    ];
    return goodbyes[Math.floor(Math.random() * goodbyes.length)];
  }
}
