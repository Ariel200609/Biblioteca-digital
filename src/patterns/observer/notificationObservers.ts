import { INotification, INotificationObserver } from './notificationSystem';

// Observer para notificaciones del sistema
export class SystemNotificationObserver implements INotificationObserver {
    private userNotifications: Map<string, INotification[]> = new Map();

    update(notification: INotification): void {
        const notifications = this.userNotifications.get(notification.userId) || [];
        notifications.push(notification);
        this.userNotifications.set(notification.userId, notifications);
        
        // Mostrar la notificación en el sistema
        console.log(`Nueva notificación recibida: ${notification.type}`);
        
        const icon = this.getNotificationIcon(notification.type);
        if (notification.priority === 'HIGH') {
            console.log(`URGENT notification: ${notification.message}`);
        } else {
            console.log(`${icon} Sistema: ${notification.message}`);
        }
    }

    private isLoanNotification(type: string): boolean {
        return ['LOAN_CREATED', 'LOAN_DUE', 'LOAN_OVERDUE', 'LOAN_RETURNED', 'LOAN_RENEWED', 'SYSTEM'].includes(type);
    }

    private getNotificationIcon(type: string): string {
        const icons: { [key: string]: string } = {
            LOAN_CREATED: '📚',
            LOAN_DUE: '⏰',
            LOAN_OVERDUE: '⚠️',
            LOAN_RETURNED: '✅',
            LOAN_RENEWED: '🔄'
        };
        return icons[type] || '📣';
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