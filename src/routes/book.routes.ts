import { Router } from 'express';
import { BookController } from '../controllers/book.controllers';

const router = Router();
const bookController = new BookController();

router.get('/', bookController.getAll);
router.post('/', bookController.create);
router.get('/:id', bookController.getById);
router.put('/:id', bookController.update);
router.delete('/:id', bookController.delete);

export const bookRoutes = router;