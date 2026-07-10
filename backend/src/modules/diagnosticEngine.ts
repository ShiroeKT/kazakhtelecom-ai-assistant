import { DiagnosticNode, ServiceCategory, Malfunction, Answer } from '../types';
import { getDiagnosticTree } from './knowledgeBase';

export class DiagnosticEngine {
  private trees: Record<ServiceCategory, DiagnosticNode[]>;

  constructor() {
    this.trees = {
      internet: getDiagnosticTree('internet'),
      tv: getDiagnosticTree('tv'),
      telephony: getDiagnosticTree('telephony'),
      mobile: getDiagnosticTree('mobile'),
      equipment: getDiagnosticTree('equipment')
    };
  }

  startDiagnostic(category: ServiceCategory): DiagnosticNode {
    const tree = this.trees[category];
    if (!tree || tree.length === 0) {
      throw new Error(`No diagnostic tree found for category: ${category}`);
    }
    return tree[0];
  }

  getNextNode(currentNodeId: string, answerIndex: number, category: ServiceCategory): DiagnosticNode | null {
    const tree = this.trees[category];
    const currentNode = tree.find(node => node.id === currentNodeId);
    
    if (!currentNode || !currentNode.answers[answerIndex]) {
      return null;
    }

    const nextNodeId = currentNode.answers[answerIndex].nextNodeId;
    if (!nextNodeId) {
      return null;
    }

    const nextNode = tree.find(node => node.id === nextNodeId);
    return nextNode || null;
  }

  getNodeById(nodeId: string, category: ServiceCategory): DiagnosticNode | null {
    const tree = this.trees[category];
    return tree.find(node => node.id === nodeId) || null;
  }

  getAnswers(nodeId: string, category: ServiceCategory): Answer[] {
    const node = this.getNodeById(nodeId, category);
    return node?.answers || [];
  }

  isTerminalNode(nodeId: string, category: ServiceCategory): boolean {
    const node = this.getNodeById(nodeId, category);
    return node?.isTerminal || false;
  }

  getDiagnosis(nodeId: string, category: ServiceCategory): Malfunction | null {
    const node = this.getNodeById(nodeId, category);
    return node?.diagnosis || null;
  }

  getDiagnosticPath(category: ServiceCategory, answerSequence: number[]): DiagnosticNode[] {
    const path: DiagnosticNode[] = [];
    let currentNode = this.startDiagnostic(category);
    
    path.push(currentNode);

    for (const answerIndex of answerSequence) {
      if (currentNode.isTerminal) break;
      
      const nextNode = this.getNextNode(currentNode.id, answerIndex, category);
      if (!nextNode) break;
      
      currentNode = nextNode;
      path.push(currentNode);
    }

    return path;
  }

  getAllNodes(category: ServiceCategory): DiagnosticNode[] {
    return this.trees[category] || [];
  }
}
