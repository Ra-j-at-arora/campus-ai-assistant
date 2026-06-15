import { ai } from '../config/gemini';
import { toolDefinitions } from '../tools/toolDefinitions';
import { ToolExecutor } from '../executor/ToolExecutor';
import { ContextManager } from '../context/ContextManager';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt';
import { AnalyticsService } from '../../services/analyticsService';

async function generateWithRetry(model: string, contents: any[], config: any, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent({ model, contents, config });
    } catch (error: any) {
      if (i === retries - 1) throw error; // Re-throw on last attempt
      
      const isRateLimited = error?.message?.includes('503') || error?.message?.includes('429');
      if (isRateLimited) {
        // Exponential backoff: 1s, 2s, 4s
        const waitTime = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        throw error; // Not a rate limit error, fail immediately
      }
    }
  }
}

export class ChatOrchestrator {
  static async handleMessage(userId: string, message: string): Promise<string> {
    const startTime = Date.now();
    let toolsCalled: string[] = [];
    let isSuccess = true;

    try {
      // 1. Save user's message
      await ContextManager.saveInteraction(userId, 'user', message);

      // 2. Load context
      const history = await ContextManager.loadHistory(userId);

      let contents = [...history];

      // Send initial request to Gemini with tools
      const response: any = await generateWithRetry('gemini-2.5-flash', contents, {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: toolDefinitions }],
      });

      let finalMessage = '';

      // 4. Check for function calls
      if (response.functionCalls && response.functionCalls.length > 0) {
        // Map the function calls
        const toolCalls = response.functionCalls.map((fc: any) => ({
          name: fc.name,
          args: fc.args as Record<string, any>
        }));
        
        toolsCalled = toolCalls.map((tc: any) => tc.name);

        // Execute all tools in parallel
        const toolResults = await ToolExecutor.executeAll(toolCalls);

        // We need to simulate sending the tool result back to Gemini.
        // Google Gen AI SDK expects us to append the model's functionCall and our functionResponse to the contents array.
        
        contents.push({
          role: 'model',
          parts: response.functionCalls.map((fc: any) => ({ functionCall: fc }))
        } as any);

        contents.push({
          role: 'user', // function responses are typically sent as user role or tool role depending on SDK version
          parts: toolResults.map((result, index) => ({
            functionResponse: {
              name: toolCalls[index].name,
              response: { result }
            }
          }))
        } as any);

        // 5. Send tool results back to Gemini for final synthesis
        const finalResponse: any = await generateWithRetry('gemini-2.5-flash', contents, {
          systemInstruction: SYSTEM_PROMPT,
          tools: [{ functionDeclarations: toolDefinitions }],
        });

        finalMessage = finalResponse.text || 'Sorry, I could not generate a response.';
      } else {
        // 6. No tools were called, direct response
        finalMessage = response.text || 'Sorry, I am not sure how to respond.';
      }

      // 7. Save AI's response
      await ContextManager.saveInteraction(userId, 'model', finalMessage);

      // Async logging
      AnalyticsService.logInteraction({
        userId,
        queryText: message,
        toolsCalled,
        responseTime: Date.now() - startTime,
        success: isSuccess,
      });

      return finalMessage;

    } catch (error: any) {
      console.error('ChatOrchestrator Error:', error);
      isSuccess = false;
      
      // Async logging on failure
      AnalyticsService.logInteraction({
        userId,
        queryText: message,
        toolsCalled,
        responseTime: Date.now() - startTime,
        success: isSuccess,
      });

      return `I am currently experiencing technical difficulties connecting to my services. Error: ${error.message}`;
    }
  }
}
