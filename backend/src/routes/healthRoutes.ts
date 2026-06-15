import { Router } from 'express';
import {
  checkLibraryHealth,
  checkEventsHealth,
  checkCafeteriaHealth,
  checkAcademicHealth,
  checkAiHealth,
} from '../controllers/healthController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Protect health endpoints so only admins can view them
router.use(requireAdmin);

router.get('/library', checkLibraryHealth);
router.get('/events', checkEventsHealth);
router.get('/cafeteria', checkCafeteriaHealth);
router.get('/academic', checkAcademicHealth);
router.get('/ai', checkAiHealth);

export default router;
