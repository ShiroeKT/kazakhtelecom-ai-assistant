import express, { Request, Response } from 'express';
import cors from 'cors';
import { SymptomAnalyzer } from './modules/symptomAnalyzer';
import { DiagnosticEngine } from './modules/diagnosticEngine';
import { ResponseGenerator } from './modules/responseGenerator';
import { ConversationManager } from './modules/conversationManager';
import { ServiceCategory } from './types';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const symptomAnalyzer = new SymptomAnalyzer();
const diagnosticEngine = new DiagnosticEngine();
const responseGenerator = new ResponseGenerator();
const conversationManager = new ConversationManager();

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/session', (req: Request, res: Response) => {
  try {
    const { subscriberInfo } = req.body;
    const session = conversationManager.createSession(subscriberInfo);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.get('/api/session/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = conversationManager.getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get session' });
  }
});

app.post('/api/analyze', (req: Request, res: Response) => {
  try {
    const { input, sessionId } = req.body;
    
    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    const analysis = symptomAnalyzer.analyze(input);
    
    if (sessionId) {
      conversationManager.addMessage(sessionId, {
        role: 'user',
        content: input,
        timestamp: Date.now()
      });
      
      analysis.detectedSymptoms.forEach(symptom => {
        conversationManager.addSymptom(sessionId, symptom);
      });
    }
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze input' });
  }
});

app.post('/api/diagnostic/start', (req: Request, res: Response) => {
  try {
    const { category, sessionId } = req.body;
    
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    const startNode = diagnosticEngine.startDiagnostic(category as ServiceCategory);
    
    if (sessionId) {
      conversationManager.setCategory(sessionId, category as ServiceCategory);
      conversationManager.addMessage(sessionId, {
        role: 'assistant',
        content: responseGenerator.generateDiagnosticQuestion(
          startNode.question,
          startNode.answers.map(a => a.text)
        ),
        timestamp: Date.now(),
        type: 'question'
      });
    }
    
    res.json({
      node: startNode,
      question: responseGenerator.generateDiagnosticQuestion(
        startNode.question,
        startNode.answers.map(a => a.text)
      )
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start diagnostic' });
  }
});

app.post('/api/diagnostic/next', (req: Request, res: Response) => {
  try {
    const { currentNodeId, answerIndex, category, sessionId } = req.body;
    
    if (!currentNodeId || answerIndex === undefined || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const nextNode = diagnosticEngine.getNextNode(
      currentNodeId,
      answerIndex,
      category as ServiceCategory
    );
    
    if (!nextNode) {
      return res.status(404).json({ error: 'Next node not found' });
    }

    const currentNode = diagnosticEngine.getNodeById(currentNodeId, category as ServiceCategory);
    const selectedAnswer = currentNode?.answers[answerIndex];

    if (sessionId) {
      conversationManager.setCurrentNode(sessionId, nextNode.id);
      
      if (selectedAnswer) {
        conversationManager.addMessage(sessionId, {
          role: 'user',
          content: selectedAnswer.text,
          timestamp: Date.now()
        });
      }

      if (nextNode.isTerminal && nextNode.diagnosis) {
        conversationManager.setDiagnosis(sessionId, nextNode.diagnosis);
        conversationManager.addMessage(sessionId, {
          role: 'assistant',
          content: responseGenerator.generateDiagnosis(nextNode.diagnosis),
          timestamp: Date.now(),
          type: 'diagnosis'
        });
      } else {
        conversationManager.addMessage(sessionId, {
          role: 'assistant',
          content: responseGenerator.generateDiagnosticQuestion(
            nextNode.question,
            nextNode.answers.map(a => a.text)
          ),
          timestamp: Date.now(),
          type: 'question'
        });
      }
    }
    
    res.json({
      node: nextNode,
      isTerminal: nextNode.isTerminal,
      diagnosis: nextNode.diagnosis,
      question: nextNode.isTerminal 
        ? null 
        : responseGenerator.generateDiagnosticQuestion(
            nextNode.question,
            nextNode.answers.map(a => a.text)
          )
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get next diagnostic node' });
  }
});

app.post('/api/diagnostic/reset', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    
    if (sessionId) {
      conversationManager.resetSession(sessionId);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset diagnostic' });
  }
});

app.post('/api/response/generate', (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;
    
    let response = '';
    
    switch (type) {
      case 'greeting':
        response = responseGenerator.generateGreeting();
        break;
      case 'clarification':
        response = responseGenerator.generateClarification(data.questions || []);
        break;
      case 'diagnosis':
        response = responseGenerator.generateDiagnosis(data.diagnosis);
        break;
      case 'subscriber':
        response = responseGenerator.generateSubscriberText(data.diagnosis, data.subscriberName);
        break;
      case 'technician':
        response = responseGenerator.generateTechnicianInfo();
        break;
      case 'category':
        response = responseGenerator.generateCategorySelection();
        break;
      case 'goodbye':
        response = responseGenerator.generateGoodbye();
        break;
      default:
        return res.status(400).json({ error: 'Invalid response type' });
    }
    
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.get('/api/symptoms', (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    if (category) {
      const symptoms = symptomAnalyzer.getSymptomsByCategory(category as ServiceCategory);
      res.json(symptoms);
    } else {
      res.json(symptomAnalyzer['symptoms']);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get symptoms' });
  }
});

app.delete('/api/session/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const deleted = conversationManager.deleteSession(sessionId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
