import Fuse from 'fuse.js';
import { Symptom, ServiceCategory, AnalysisResult } from '../types';
import { getAllSymptoms } from './knowledgeBase';

export class SymptomAnalyzer {
  private symptoms: Symptom[];
  private fuse: Fuse<Symptom>;

  constructor() {
    this.symptoms = getAllSymptoms();
    this.fuse = new Fuse(this.symptoms, {
      keys: ['keywords', 'description'],
      threshold: 0.4,
      includeScore: true
    });
  }

  analyze(input: string): AnalysisResult {
    const normalizedInput = this.normalizeText(input);
    const detectedSymptoms = this.detectSymptoms(normalizedInput);
    const suggestedCategory = this.suggestCategory(detectedSymptoms);
    const clarifyingQuestions = this.generateClarifyingQuestions(detectedSymptoms, suggestedCategory);
    const confidence = this.calculateConfidence(detectedSymptoms, normalizedInput);

    return {
      detectedSymptoms,
      confidence,
      suggestedCategory,
      clarifyingQuestions
    };
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  private detectSymptoms(input: string): Symptom[] {
    const results = this.fuse.search(input);
    const detectedSymptoms = results.map(result => result.item);
    
    // Remove duplicates
    const uniqueSymptoms = detectedSymptoms.filter((symptom, index, self) =>
      index === self.findIndex(s => s.id === symptom.id)
    );

    return uniqueSymptoms;
  }

  private suggestCategory(symptoms: Symptom[]): ServiceCategory {
    if (symptoms.length === 0) return 'internet';

    const categoryCount: Record<ServiceCategory, number> = {
      internet: 0,
      tv: 0,
      telephony: 0,
      mobile: 0,
      equipment: 0
    };

    symptoms.forEach(symptom => {
      categoryCount[symptom.category]++;
    });

    return Object.entries(categoryCount).reduce((a, b) => 
      categoryCount[a[0] as ServiceCategory] > categoryCount[b[0] as ServiceCategory] ? a : b
    )[0] as ServiceCategory;
  }

  private generateClarifyingQuestions(symptoms: Symptom[], category: ServiceCategory): string[] {
    const questions: string[] = [];

    if (symptoms.length === 0) {
      return this.getDefaultQuestions(category);
    }

    const categories = [...new Set(symptoms.map(s => s.category))];
    
    if (categories.length > 1) {
      questions.push('У вас проблемы с несколькими услугами одновременно?');
    }

    symptoms.forEach(symptom => {
      switch (symptom.id) {
        case 'no_internet':
          questions.push('Интернет отсутствует полностью или работает частично?');
          questions.push('Проблема возникла внезапно или постепенно?');
          break;
        case 'slow_internet':
          questions.push('Как давно вы заметили снижение скорости?');
          questions.push('Проблема на всех устройствах или только на одном?');
          break;
        case 'wifi_not_working':
          questions.push('Видит ли ваше устройство сеть Wi-Fi?');
          questions.push('Проблема с Wi-Fi или с кабельным подключением?');
          break;
        case 'no_tv_signal':
          questions.push('Приставка включена? Горят ли индикаторы?');
          questions.push('Проблема на всех каналах или на некоторых?');
          break;
        case 'no_dial_tone':
          questions.push('Телефон подключен к розетке?');
          questions.push('Проблема только с исходящими или со всеми звонками?');
          break;
        case 'no_mobile_signal':
          questions.push('Включен ли режим полета?');
          questions.push('Проблема в одном месте или везде?');
          break;
      }
    });

    return questions.slice(0, 5);
  }

  private getDefaultQuestions(category: ServiceCategory): string[] {
    switch (category) {
      case 'internet':
        return [
          'Какая именно проблема с интернетом?',
          'Интернет отсутствует полностью или работает медленно?',
          'Проблема на всех устройствах или только на одном?'
        ];
      case 'tv':
        return [
          'Какая проблема с телевидением?',
          'Нет сигнала или плохое качество изображения?',
          'Приставка включена?'
        ];
      case 'telephony':
        return [
          'Какая проблема со стационарным телефоном?',
          'Нет гудка или проблемы со звоном?',
          'Телефон подключен к розетке?'
        ];
      case 'mobile':
        return [
          'Какая проблема с мобильной связью?',
          'Нет сети или медленный интернет?',
          'Проблема в одном месте или везде?'
        ];
      case 'equipment':
        return [
          'Какое оборудование вызывает проблемы?',
          'Роутер не работает или перегревается?',
          'Горят ли индикаторы на устройстве?'
        ];
      default:
        return ['Опишите вашу проблему подробнее.'];
    }
  }

  private calculateConfidence(symptoms: Symptom[], input: string): number {
    if (symptoms.length === 0) return 0;
    if (input.length < 10) return 0.3;

    const baseConfidence = Math.min(symptoms.length * 0.3, 0.9);
    const lengthBonus = Math.min(input.length / 50, 0.1);
    
    return Math.min(baseConfidence + lengthBonus, 1);
  }

  getSymptomsByCategory(category: ServiceCategory): Symptom[] {
    return this.symptoms.filter(s => s.category === category);
  }
}
