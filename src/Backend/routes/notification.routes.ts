import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controllers';
import { notificationSystemInstance, systemNotificationObserverInstance } from '../services/instances';

const router = Router();

// Usar instancias singleton del sistema de notificaciones y observer
const notificationController = new NotificationController(notificationSystemInstance, systemNotificationObserverInstance);

// Rutas de notificaciones
router.get('/user/:userId', (req, res) => notificationController.getUserNotifications(req, res));
router.post('/user/:userId/:notificationId/read', (req, res) => notificationController.markAsRead(req, res));
router.post('/user/:userId/read-all', (req, res) => notificationController.markAllAsRead(req, res));

export default router;