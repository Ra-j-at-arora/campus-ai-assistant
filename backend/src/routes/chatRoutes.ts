import { Router } from 'express';
import { processChatMessage, getChatHistory } from '../controllers/chatController';

const router = Router();

// GET /api/v1/chat/history
router.get('/history', getChatHistory);

// POST /api/v1/chat
router.post('/', processChatMessage);

export default router;
