import { Router } from 'express';
import { UserController } from '../controllers/user.controllers';

const router = Router();
const userController = new UserController();

router.get('/', userController.getAll);
router.post('/', userController.create);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export const userRoutes = router;