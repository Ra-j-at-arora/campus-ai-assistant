import { Router } from 'express';
import { listEvents, getUpcomingEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';

const router = Router();

router.get('/upcoming', getUpcomingEvents);
router.get('/', listEvents);
router.get('/:id', getEventById);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
