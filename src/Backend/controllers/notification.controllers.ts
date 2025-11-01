import { Request, Response } from 'express';
import { SystemNotificationObserver } from '../patterns/observer/notificationObservers';
import { NotificationSystem } from '../patterns/observer/notificationSystem';

export class NotificationController {
    constructor(
        private notificationSystem: NotificationSystem,
        private systemObserver: SystemNotificationObserver
    ) {}

    // Obtener todas las notificaciones del usuario
    async getUserNotifications(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const { unreadOnly, type, limit } = req.query;

            const notifications = this.systemObserver.getUserNotifications(userId, {
                onlyUnread: unreadOnly === 'true',
                type: type ? (type as string).split(',') : undefined,
                limit: limit ? parseInt(limit as string) : undefined
            });

            res.json(notifications);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener notificaciones',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    // Marcar una notificación como leída
    async markAsRead(req: Request, res: Response) {
        try {
            const { userId, notificationId } = req.params;
            const success = this.systemObserver.markAsRead(userId, notificationId);

            if (!success) {
                return res.status(404).json({
                    message: 'Notificación no encontrada'
                });
            }

            res.json({
                message: 'Notificación marcada como leída'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al marcar notificación como leída',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    // Marcar todas las notificaciones como leídas
    async markAllAsRead(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const count = this.systemObserver.markAllAsRead(userId);

            res.json({
                message: `${count} notificaciones marcadas como leídas`
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al marcar notificaciones como leídas',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}