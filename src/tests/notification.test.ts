import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationSystem, INotification } from '../patterns/observer/notificationSystem';
import { EmailNotificationObserver, SystemNotificationObserver, UrgentNotificationObserver } from '../patterns/observer/notificationObservers';
import { LoanNotificationService } from '../patterns/observer/loanNotificationService';
import { LoanService } from '../services/loan.services';
import { LoanStatus } from '../models/loan.models';

describe('Notification System', () => {
    let notificationSystem: NotificationSystem;
    let emailObserver: EmailNotificationObserver;
    let systemObserver: SystemNotificationObserver;
    let urgentObserver: UrgentNotificationObserver;

    beforeEach(() => {
        notificationSystem = new NotificationSystem();
        emailObserver = new EmailNotificationObserver();
        systemObserver = new SystemNotificationObserver();
        urgentObserver = new UrgentNotificationObserver();

        // Spy on console.log
        vi.spyOn(console, 'log');
    });

    it('should notify all observers', () => {
        notificationSystem.attach(emailObserver);
        notificationSystem.attach(systemObserver);

        const notification: INotification = {
            userId: '1',
            message: 'Test notification',
            type: 'SYSTEM',
            createdAt: new Date()
        };

        notificationSystem.notify(notification);

        expect(console.log).toHaveBeenCalledTimes(2);
    });

    it('should handle urgent notifications properly', () => {
        notificationSystem.attach(urgentObserver);

        const urgentNotification: INotification = {
            userId: '1',
            message: 'Overdue book!',
            type: 'LOAN_OVERDUE',
            createdAt: new Date()
        };

        notificationSystem.notify(urgentNotification);

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('URGENT notification')
        );
    });

    it('should store system notifications for users', () => {
        const notification: INotification = {
            userId: '1',
            message: 'Test notification',
            type: 'SYSTEM',
            createdAt: new Date()
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

        // Mock the notification system's notify method
        vi.spyOn(notificationSystem, 'notify');
    });

    it('should notify about loans due in 3 days', async () => {
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

        // Mock the loan service to return our test loans
        vi.spyOn(loanService, 'getAllLoans').mockResolvedValue(mockLoans);

        await loanNotificationService.checkDueDates();

        expect(notificationSystem.notify).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'LOAN_DUE',
                userId: '1'
            })
        );
    });

    it('should notify about overdue loans', async () => {
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