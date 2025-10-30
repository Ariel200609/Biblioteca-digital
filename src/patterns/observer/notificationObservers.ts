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
    private userNotifications: Map<string, INotification[]> = new Map();

    update(notification: INotification): void {
        const notifications = this.userNotifications.get(notification.userId) || [];
        notifications.push(notification);
        this.userNotifications.set(notification.userId, notifications);
        console.log(`🔔 System notification for ${notification.userId}: ${notification.message}`);
    }

    getUserNotifications(userId: string, options?: {
        onlyUnread?: boolean;
        type?: string[];
        limit?: number;
    }): INotification[] {
        let notifications = this.userNotifications.get(userId) || [];

        if (options?.onlyUnread) {
            notifications = notifications.filter(n => !n.read);
        }

        if (options?.type) {
            notifications = notifications.filter(n => options.type!.includes(n.type));
        }

        if (options?.limit) {
            notifications = notifications.slice(0, options.limit);
        }

        return notifications;
    }

    markAsRead(userId: string, notificationId: string): boolean {
        const notifications = this.userNotifications.get(userId);
        if (!notifications) return false;

        const notification = notifications.find(n => n.id === notificationId);
        if (!notification) return false;

        notification.read = true;
        return true;
    }

    markAllAsRead(userId: string): number {
        const notifications = this.userNotifications.get(userId);
        if (!notifications) return 0;

        let count = 0;
        notifications.forEach(notification => {
            if (!notification.read) {
                notification.read = true;
                count++;
            }
        });

        return count;
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