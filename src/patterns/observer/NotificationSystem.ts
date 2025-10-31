export interface INotification {
    userId: string;
    message: string;
    type: 'LOAN_DUE' | 'BOOK_AVAILABLE' | 'SYSTEM';
    createdAt: Date;
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