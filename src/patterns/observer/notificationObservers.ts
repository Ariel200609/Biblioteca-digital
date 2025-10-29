import { INotification, INotificationObserver } from './notificationSystem';

// Observer para notificaciones por email
export class EmailNotificationObserver implements INotificationObserver {
    update(notification: INotification): void {
        // En una implementación real, aqui se enviaria un email
        console.log(`📧 Email to ${notification.userId}: ${notification.message}`);
    }
}

// Observer para notificaciones en el sistema
export class SystemNotificationObserver implements INotificationObserver {
    private notifications: Map<string, INotification[]> = new Map();

    update(notification: INotification): void {
        const userNotifications = this.notifications.get(notification.userId) || [];
        userNotifications.push(notification);
        this.notifications.set(notification.userId, userNotifications);
        console.log(`🔔 System notification for ${notification.userId}: ${notification.message}`);
    }

    // Obtener notificaciones de un usuario
    getUserNotifications(userId: string): INotification[] {
        return this.notifications.get(userId) || [];
    }

    // Marcar notificaciones como leidas
    markAsRead(userId: string): void {
        this.notifications.delete(userId);
    }
}

// Observer para notificaciones urgentes (SMS/Push)
export class UrgentNotificationObserver implements INotificationObserver {
    update(notification: INotification): void {
        if (this.isUrgent(notification)) {
            // En una implementación real, aqui se enviaria un SMS o notificación push
            console.log(`🚨 URGENT notification to ${notification.userId}: ${notification.message}`);
        }
    }

    private isUrgent(notification: INotification): boolean {
        return ['LOAN_OVERDUE', 'LOAN_DUE'].includes(notification.type);
    }
}