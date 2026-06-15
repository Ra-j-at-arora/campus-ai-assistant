import { Router } from 'express';
import { getDailyMenu, getMenuByDate, createMenu, updateMenu, deleteMenu } from '../controllers/cafeteriaController';

const router = Router();

router.get('/today', getDailyMenu);
router.get('/', getMenuByDate);
router.post('/', createMenu);
router.put('/:id', updateMenu);
router.delete('/:id', deleteMenu);

export default router;
