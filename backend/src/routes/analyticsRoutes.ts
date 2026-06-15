import { Router } from 'express';
import {
  getOverview,
  getQueryTrends,
  getServiceDistribution,
  getIntentDistribution,
  getQueryExplorer
} from '../controllers/analyticsController';
import { requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Protect all analytics endpoints
router.use(requireAdmin);

router.get('/overview', getOverview);
router.get('/charts/trends', getQueryTrends);
router.get('/charts/services', getServiceDistribution);
router.get('/charts/intents', getIntentDistribution);
router.get('/explorer', getQueryExplorer);

export default router;
