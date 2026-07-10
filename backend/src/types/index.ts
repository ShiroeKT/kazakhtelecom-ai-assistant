export interface Symptom {
  id: string;
  keywords: string[];
  category: ServiceCategory;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export type ServiceCategory = 
  | 'internet'
  | 'tv'
  | 'telephony'
  | 'mobile'
  | 'equipment';

export interface DiagnosticNode {
  id: string;
  question: string;
  symptoms?: string[];
  answers: Answer[];
  isTerminal: boolean;
  diagnosis?: Malfunction;
}

export interface Answer {
  text: string;
  nextNodeId?: string;
  action?: string;
}

export interface Malfunction {
  id: string;
  name: string;
  category: ServiceCategory;
  severity: 'low' | 'medium' | 'high';
  description: string;
  possibleCauses: string[];
  solutions: Solution[];
  estimatedResolutionTime: string;
  requiresTechnician: boolean;
}

export interface Solution {
  step: number;
  description: string;
  actionType: 'instruction' | 'check' | 'reset' | 'configuration';
  details?: string;
}

export interface ConversationState {
  sessionId: string;
  currentSymptoms: Symptom[];
  currentNodeId?: string;
  diagnosedMalfunction?: Malfunction;
  conversationHistory: Message[];
  subscriberInfo?: SubscriberInfo;
  timestamp: number;
}

export interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
  type?: 'question' | 'diagnosis' | 'solution' | 'clarification';
}

export interface SubscriberInfo {
  contractNumber?: string;
  phoneNumber?: string;
  address?: string;
  servicePlan?: string;
}

export interface AnalysisResult {
  detectedSymptoms: Symptom[];
  confidence: number;
  suggestedCategory: ServiceCategory;
  clarifyingQuestions: string[];
}
