import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';
import { ChatOrchestrator } from '../ai/orchestrator/ChatOrchestrator';
import ChatHistory from '../models/ChatHistory';

const chatSchema = z.object({
  message: z.string().min(1),
  // In a real system, userId would come from JWT token middleware.
  // For the sake of the orchestrator demo, we will extract it from body or use a dummy ID if missing
  userId: z.string().optional(),
});

export const processChatMessage = asyncHandler(async (req: Request, res: Response) => {
  const { message, userId = 'default_user' } = chatSchema.parse(req.body);

  // Send the message to the AI Orchestrator
  const aiResponse = await ChatOrchestrator.handleMessage(userId, message);

  res.status(200).json({
    success: true,
    data: {
      response: aiResponse,
    }
  });
});

export const getChatHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.query.userId as string || 'default_user';
  
  const chatSession = await ChatHistory.findOne({ userId, sessionId: 'default' });
  let messages = chatSession?.messages || [];
  
  // Return up to 50 messages chronologically
  messages = messages.slice(-50);
  
  res.status(200).json({
    success: true,
    data: messages
  });
});
