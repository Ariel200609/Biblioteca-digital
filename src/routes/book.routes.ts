import { Router } from 'express';
import { BookController } from '../controllers/book.controllers';

const router = Router();
const bookController = new BookController();

router.get('/search', bookController.search); // La ruta de busqueda debe ir antes de /:id para evitar conflictos
router.get('/', bookController.getAll);
router.post('/', bookController.create);
router.get('/:id', bookController.getById);
router.put('/:id', bookController.update);
router.delete('/:id', bookController.remove);

export const bookRoutes = router;