import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controllers';
import { NotificationSystem } from '../patterns/observer/notificationSystem';
import { SystemNotificationObserver } from '../patterns/observer/notificationObservers';

const router = Router();

// Crear instancias necesarias
const notificationSystem = new NotificationSystem();
const systemObserver = new SystemNotificationObserver();
notificationSystem.attach(systemObserver);

const notificationController = new NotificationController(notificationSystem, systemObserver);

// Rutas de notificaciones
router.get('/user/:userId', (req, res) => notificationController.getUserNotifications(req, res));
router.post('/user/:userId/:notificationId/read', (req, res) => notificationController.markAsRead(req, res));
router.post('/user/:userId/read-all', (req, res) => notificationController.markAllAsRead(req, res));

export default router;