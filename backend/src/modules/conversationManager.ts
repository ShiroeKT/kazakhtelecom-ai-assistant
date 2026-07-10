import { ConversationState, Message, ServiceCategory, SubscriberInfo } from '../types';

export class ConversationManager {
  private conversations: Map<string, ConversationState>;

  constructor() {
    this.conversations = new Map();
  }

  createSession(subscriberInfo?: SubscriberInfo): ConversationState {
    const sessionId = this.generateSessionId();
    const state: ConversationState = {
      sessionId,
      currentSymptoms: [],
      conversationHistory: [],
      subscriberInfo,
      timestamp: Date.now()
    };

    this.conversations.set(sessionId, state);
    return state;
  }

  getSession(sessionId: string): ConversationState | null {
    return this.conversations.get(sessionId) || null;
  }

  updateSession(sessionId: string, updates: Partial<ConversationState>): ConversationState | null {
    const state = this.conversations.get(sessionId);
    if (!state) return null;

    const updatedState = {
      ...state,
      ...updates,
      timestamp: Date.now()
    };

    this.conversations.set(sessionId, updatedState);
    return updatedState;
  }

  addMessage(sessionId: string, message: Message): ConversationState | null {
    const state = this.conversations.get(sessionId);
    if (!state) return null;

    state.conversationHistory.push(message);
    state.timestamp = Date.now();

    this.conversations.set(sessionId, state);
    return state;
  }

  setCurrentNode(sessionId: string, nodeId: string): ConversationState | null {
    return this.updateSession(sessionId, { currentNodeId: nodeId });
  }

  setCategory(sessionId: string, category: ServiceCategory): ConversationState | null {
    return this.updateSession(sessionId, { currentNodeId: `${category}_start` });
  }

  setDiagnosis(sessionId: string, diagnosis: any): ConversationState | null {
    return this.updateSession(sessionId, { diagnosedMalfunction: diagnosis });
  }

  addSymptom(sessionId: string, symptom: any): ConversationState | null {
    const state = this.conversations.get(sessionId);
    if (!state) return null;

    const exists = state.currentSymptoms.some(s => s.id === symptom.id);
    if (!exists) {
      state.currentSymptoms.push(symptom);
    }

    state.timestamp = Date.now();
    this.conversations.set(sessionId, state);
    return state;
  }

  deleteSession(sessionId: string): boolean {
    return this.conversations.delete(sessionId);
  }

  clearOldSessions(maxAge: number = 24 * 60 * 60 * 1000): number {
    const now = Date.now();
    let deleted = 0;

    for (const [sessionId, state] of this.conversations.entries()) {
      if (now - state.timestamp > maxAge) {
        this.conversations.delete(sessionId);
        deleted++;
      }
    }

    return deleted;
  }

  getAllSessions(): ConversationState[] {
    return Array.from(this.conversations.values());
  }

  getSessionCount(): number {
    return this.conversations.size;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  resetSession(sessionId: string): ConversationState | null {
    const state = this.conversations.get(sessionId);
    if (!state) return null;

    const resetState: ConversationState = {
      sessionId,
      currentSymptoms: [],
      conversationHistory: [],
      subscriberInfo: state.subscriberInfo,
      timestamp: Date.now()
    };

    this.conversations.set(sessionId, resetState);
    return resetState;
  }
}
