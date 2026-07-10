import { DiagnosticNode, AnalysisResult, Message } from '../types';

const API_BASE = '/api';

export const api = {
  async createSession(subscriberInfo?: any) {
    const response = await fetch(`${API_BASE}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriberInfo })
    });
    return response.json();
  },

  async getSession(sessionId: string) {
    const response = await fetch(`${API_BASE}/session/${sessionId}`);
    return response.json();
  },

  async analyzeInput(input: string, sessionId?: string) {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, sessionId })
    });
    return response.json() as Promise<AnalysisResult>;
  },

  async startDiagnostic(category: string, sessionId?: string) {
    const response = await fetch(`${API_BASE}/diagnostic/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, sessionId })
    });
    return response.json() as Promise<{ node: DiagnosticNode; question: string }>;
  },

  async getNextNode(currentNodeId: string, answerIndex: number, category: string, sessionId?: string) {
    const response = await fetch(`${API_BASE}/diagnostic/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentNodeId, answerIndex, category, sessionId })
    });
    return response.json() as Promise<{ node: DiagnosticNode; isTerminal: boolean; diagnosis?: any; question?: string }>;
  },

  async resetDiagnostic(sessionId?: string) {
    const response = await fetch(`${API_BASE}/diagnostic/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    return response.json();
  },

  async generateResponse(type: string, data: any) {
    const response = await fetch(`${API_BASE}/response/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    });
    return response.json() as Promise<{ response: string }>;
  },

  async getSymptoms(category?: string) {
    const url = category ? `${API_BASE}/symptoms?category=${category}` : `${API_BASE}/symptoms`;
    const response = await fetch(url);
    return response.json();
  },

  async deleteSession(sessionId: string) {
    const response = await fetch(`${API_BASE}/session/${sessionId}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};
