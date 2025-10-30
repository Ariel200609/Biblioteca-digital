import { NotificationType } from './notificationSystem';

// Interfaz base para metadatos de notificaciones
export interface BaseNotificationMetadata {
    timestamp: Date;
}

// Metadatos específicos para notificaciones de préstamos
export interface LoanNotificationMetadata extends BaseNotificationMetadata {
    loanId: string;
    bookId: string;
    dueDate: Date;
    daysUntilDue?: number;
    daysOverdue?: number;
}

// Metadatos específicos para notificaciones de libros
export interface BookNotificationMetadata extends BaseNotificationMetadata {
    bookId: string;
    title: string;
}

// Tipos de metadatos de notificaciones
export type NotificationMetadata = 
    | LoanNotificationMetadata 
    | BookNotificationMetadata 
    | BaseNotificationMetadata;

// Interfaz extendida para notificaciones
export interface NotificationDetails {
    id: string;
    userId: string;
    type: NotificationType;
    message: string;
    createdAt: Date;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    read: boolean;
    metadata: NotificationMetadata;
}

// Clase base para notificaciones
export abstract class BaseNotification {
    public readonly id: string;
    public readonly createdAt: Date;
    public read: boolean;

    constructor(
        public readonly userId: string,
        public readonly type: NotificationType,
        public readonly message: string,
        public readonly priority: 'LOW' | 'MEDIUM' | 'HIGH',
        public readonly metadata: NotificationMetadata
    ) {
        this.id = Date.now().toString();
        this.createdAt = new Date();
        this.read = false;
    }

    toDetails(): NotificationDetails {
        return {
            id: this.id,
            userId: this.userId,
            type: this.type,
            message: this.message,
            createdAt: this.createdAt,
            priority: this.priority,
            read: this.read,
            metadata: this.metadata
        };
    }
}

// Clase específica para notificaciones de préstamos
export class LoanNotification extends BaseNotification {
    constructor(
        userId: string,
        type: Extract<NotificationType, 'LOAN_CREATED' | 'LOAN_DUE' | 'LOAN_OVERDUE' | 'LOAN_RETURNED' | 'LOAN_RENEWED'>,
        message: string,
        metadata: LoanNotificationMetadata
    ) {
        const priority = type === 'LOAN_OVERDUE' ? 'HIGH' : 
                        type === 'LOAN_DUE' ? 'MEDIUM' : 'LOW';
        super(userId, type, message, priority, metadata);
    }
}

// Clase específica para notificaciones de libros
export class BookNotification extends BaseNotification {
    constructor(
        userId: string,
        type: Extract<NotificationType, 'BOOK_AVAILABLE'>,
        message: string,
        metadata: BookNotificationMetadata
    ) {
        super(userId, type, message, 'LOW', metadata);
    }
}

// Clase específica para notificaciones del sistema
export class SystemNotification extends BaseNotification {
    constructor(
        userId: string,
        message: string,
        metadata: BaseNotificationMetadata = { timestamp: new Date() }
    ) {
        super(userId, 'SYSTEM', message, 'LOW', metadata);
    }
}