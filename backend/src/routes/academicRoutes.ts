import { Router } from 'express';
import { listResources, getUpcomingResources, createResource, updateResource, deleteResource } from '../controllers/academicController';

const router = Router();

router.get('/upcoming', getUpcomingResources);
router.get('/', listResources);
router.post('/', createResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

export default router;
