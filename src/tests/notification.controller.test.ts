import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { NotificationController } from '../controllers/notification.controllers';
import { NotificationSystem } from '../patterns/observer/notificationSystem';
import { SystemNotificationObserver } from '../patterns/observer/notificationObservers';

describe('NotificationController', () => {
    let notificationController: NotificationController;
    let notificationSystem: NotificationSystem;
    let systemObserver: SystemNotificationObserver;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonMock: any;

    beforeEach(() => {
        notificationSystem = new NotificationSystem();
        systemObserver = new SystemNotificationObserver();
        notificationController = new NotificationController(notificationSystem, systemObserver);

        jsonMock = vi.fn();
        mockResponse = {
            json: jsonMock,
            status: vi.fn().mockReturnThis()
        };
    });

    describe('getUserNotifications', () => {
        it('should return user notifications with filters', async () => {
            mockRequest = {
                params: { userId: '1' },
                query: {
                    unreadOnly: 'true',
                    type: 'LOAN_DUE,LOAN_OVERDUE',
                    limit: '10'
                }
            };

            vi.spyOn(systemObserver, 'getUserNotifications').mockReturnValue([]);

            await notificationController.getUserNotifications(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(systemObserver.getUserNotifications).toHaveBeenCalledWith('1', {
                onlyUnread: true,
                type: ['LOAN_DUE', 'LOAN_OVERDUE'],
                limit: 10
            });
            expect(jsonMock).toHaveBeenCalledWith([]);
        });
    });

    describe('markAsRead', () => {
        it('should mark notification as read', async () => {
            mockRequest = {
                params: {
                    userId: '1',
                    notificationId: '123'
                }
            };

            vi.spyOn(systemObserver, 'markAsRead').mockReturnValue(true);

            await notificationController.markAsRead(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(systemObserver.markAsRead).toHaveBeenCalledWith('1', '123');
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Notificación marcada como leída'
            });
        });

        it('should return 404 if notification not found', async () => {
            mockRequest = {
                params: {
                    userId: '1',
                    notificationId: '999'
                }
            };

            vi.spyOn(systemObserver, 'markAsRead').mockReturnValue(false);

            await notificationController.markAsRead(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                message: 'Notificación no encontrada'
            });
        });
    });

    describe('markAllAsRead', () => {
        it('should mark all notifications as read', async () => {
            mockRequest = {
                params: { userId: '1' }
            };

            vi.spyOn(systemObserver, 'markAllAsRead').mockReturnValue(5);

            await notificationController.markAllAsRead(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(systemObserver.markAllAsRead).toHaveBeenCalledWith('1');
            expect(jsonMock).toHaveBeenCalledWith({
                message: '5 notificaciones marcadas como leídas'
            });
        });
    });
});