export type NotificationType = 
    | 'LOAN_CREATED' 
    | 'LOAN_DUE' 
    | 'LOAN_OVERDUE'
    | 'LOAN_RETURNED'
    | 'LOAN_RENEWED'
    | 'BOOK_AVAILABLE' 
    | 'SYSTEM';

export interface INotification {
    id: string;
    userId: string;
    message: string;
    type: NotificationType;
    createdAt: Date;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    read: boolean;
    metadata: {
        timestamp: Date;
        [key: string]: unknown;
    };
}

export interface INotificationObserver {
    update(notification: INotification): void;
}

export class NotificationSystem {
    private observers: INotificationObserver[] = [];

    attach(observer: INotificationObserver): void {
        this.observers.push(observer);
    }

    detach(observer: INotificationObserver): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    notify(notification: INotification): void {
        for (const observer of this.observers) {
            observer.update(notification);
        }
    }
}