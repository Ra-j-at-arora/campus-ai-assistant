import { Router } from 'express';
import { searchBooks, getBookById, addBook, updateBook, deleteBook } from '../controllers/libraryController';

const router = Router();

router.get('/search', searchBooks);
router.get('/:id', getBookById);
router.post('/', addBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
