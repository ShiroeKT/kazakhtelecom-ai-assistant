export interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
  type?: 'question' | 'diagnosis' | 'solution' | 'clarification';
}

export interface DiagnosticNode {
  id: string;
  question: string;
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
  category: string;
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

export interface AnalysisResult {
  detectedSymptoms: any[];
  confidence: number;
  suggestedCategory: string;
  clarifyingQuestions: string[];
}

export type ServiceCategory = 'internet' | 'tv' | 'telephony' | 'mobile' | 'equipment';
