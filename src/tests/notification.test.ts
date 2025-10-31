import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationSystem, INotification } from '../patterns/observer/notificationSystem';
import { SystemNotificationObserver } from '../patterns/observer/notificationObservers';
import { LoanNotificationService } from '../patterns/observer/loanNotificationService';
import { LoanService } from '../services/loan.services';
import { LoanStatus } from '../models/loan.models';

describe('Notification System', () => {
    let notificationSystem: NotificationSystem;
    let systemObserver: SystemNotificationObserver;

    beforeEach(() => {
        notificationSystem = new NotificationSystem();
        systemObserver = new SystemNotificationObserver();

        // espia en console.log para verificar salidas
        vi.spyOn(console, 'log');
    });

    it('debe notificar al observador del sistema', () => {
        notificationSystem.attach(systemObserver);

        const notification: INotification = {
            id: '1',
            userId: '1',
            message: 'Test notification',
            type: 'SYSTEM',
            createdAt: new Date(),
            priority: 'LOW',
            read: false,
            metadata: {
                timestamp: new Date()
            }
        };

        notificationSystem.notify(notification);

        expect(console.log).toHaveBeenCalledTimes(2);
    });

    it('debe manejar correctamente las notificaciones urgentes', () => {
        notificationSystem.attach(systemObserver);

        const urgentNotification: INotification = {
            id: '2',
            userId: '1',
            message: 'Overdue book!',
            type: 'LOAN_OVERDUE',
            createdAt: new Date(),
            priority: 'HIGH',
            read: false,
            metadata: {
                timestamp: new Date()
            }
        };

        notificationSystem.notify(urgentNotification);

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('URGENT notification')
        );
    });

    it('debe almacenar las notificaciones del sistema para los usuarios', () => {
        const notification: INotification = {
            id: '3',
            userId: '1',
            message: 'Test notification',
            type: 'SYSTEM',
            createdAt: new Date(),
            priority: 'LOW',
            read: false,
            metadata: {
                timestamp: new Date()
            }
        };

        systemObserver.update(notification);
        const userNotifications = systemObserver.getUserNotifications('1');

        expect(userNotifications).toHaveLength(1);
        expect(userNotifications[0]).toEqual(notification);
    });
});

describe('LoanNotificationService', () => {
    let loanNotificationService: LoanNotificationService;
    let notificationSystem: NotificationSystem;
    let loanService: LoanService;

    beforeEach(() => {
        notificationSystem = new NotificationSystem();
        loanService = new LoanService(notificationSystem, null as any, null as any);
        loanNotificationService = new LoanNotificationService(loanService, notificationSystem);

        // simula la notificacion del sistema
        vi.spyOn(notificationSystem, 'notify');
    });

    it('debe notificar sobre prestamos que vencen en 3 dias', async () => {
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

        const mockLoans = [{
            id: '1',
            userId: '1',
            bookId: '1',
            status: LoanStatus.ACTIVE,
            dueDate: threeDaysFromNow,
            loanDate: new Date(),
            renewalCount: 0
        }];

        // Simula el servicio de prestamos para retornar nuestros prestamos de prueba
        vi.spyOn(loanService, 'getAllLoans').mockResolvedValue(mockLoans);

        await loanNotificationService.checkDueDates();

        expect(notificationSystem.notify).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'LOAN_DUE',
                userId: '1'
            })
        );
    });

    it('debe notificar sobre prestamos vencidos', async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const mockLoans = [{
            id: '1',
            userId: '1',
            bookId: '1',
            status: LoanStatus.ACTIVE,
            dueDate: yesterday,
            loanDate: new Date(),
            renewalCount: 0
        }];

        vi.spyOn(loanService, 'getAllLoans').mockResolvedValue(mockLoans);

        await loanNotificationService.checkDueDates();

        expect(notificationSystem.notify).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'LOAN_OVERDUE',
                userId: '1'
            })
        );
    });
});