import ChatHistory, { IChatHistory } from '../../models/ChatHistory';
import { Content } from '@google/genai';

export class ContextManager {
  /**
   * Loads the last 10 interactions for a user to maintain short-term memory.
   * Maps MongoDB ChatHistory items to GoogleGenAI Content format.
   */
  static async loadHistory(userId: string): Promise<Content[]> {
    const chatSession = await ChatHistory.findOne({ userId, sessionId: 'default' });
    if (!chatSession || !chatSession.messages) {
      return [];
    }
    
    // Only return the last 10 messages for short-term memory
    const recentMessages = chatSession.messages.slice(-10);

    const contents: Content[] = recentMessages.map((msg) => {
      // Map ChatHistory 'assistant' back to Gemini 'model'
      const mappedRole = msg.role === 'assistant' ? 'model' : msg.role;
      return {
        role: mappedRole,
        parts: [{ text: msg.content }],
      } as Content;
    });

    return contents;
  }

  /**
   * Saves an interaction to the database.
   */
  static async saveInteraction(userId: string, role: 'user' | 'model', message: string): Promise<void> {
    const dbRole = role === 'model' ? 'assistant' : role;
    
    let chatSession = await ChatHistory.findOne({ userId, sessionId: 'default' });
    
    if (!chatSession) {
      chatSession = new ChatHistory({
        userId,
        sessionId: 'default',
        messages: [],
      });
    }

    chatSession.messages.push({
      role: dbRole as any,
      content: message,
      timestamp: new Date()
    });
    chatSession.updatedAt = new Date();

    await chatSession.save();
  }
}
