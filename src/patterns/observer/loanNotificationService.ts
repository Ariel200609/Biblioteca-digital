import { LoanService } from '../../services/loan.services';
import { NotificationSystem } from './notificationSystem';
import { LoanStatus } from '../../models/loan.models';
import { LoanNotification } from './notificationTypes';

export class LoanNotificationService {
    constructor(
        private loanService: LoanService,
        private notificationSystem: NotificationSystem
    ) {}

    // Verificar préstamos próximos a vencer (ejecutar diariamente)
    async checkDueDates(): Promise<void> {
        const loans = await this.loanService.getAllLoans();
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);

        for (const loan of loans) {
            if (loan.status !== LoanStatus.ACTIVE) continue;

            // Notificar préstamos que vencen en 3 días
            if (this.isDateInRange(loan.dueDate, today, threeDaysFromNow)) {
                const daysUntil = this.getDaysUntil(loan.dueDate);
                const notification = new LoanNotification(
                    loan.userId,
                    'LOAN_DUE',
                    `Your loan for book ID ${loan.bookId} is due in ${daysUntil} days. Please return it or renew if possible.`,
                    {
                        loanId: loan.id,
                        bookId: loan.bookId,
                        dueDate: loan.dueDate,
                        daysUntilDue: daysUntil,
                        timestamp: new Date()
                    }
                );
                this.notificationSystem.notify(notification.toDetails());
            }

            // Notificar préstamos vencidos
            if (loan.dueDate < today) {
                const daysOverdue = this.getDaysSince(loan.dueDate);
                const notification = new LoanNotification(
                    loan.userId,
                    'LOAN_OVERDUE',
                    `Your loan for book ID ${loan.bookId} is overdue by ${daysOverdue} days. Please return it as soon as possible.`,
                    {
                        loanId: loan.id,
                        bookId: loan.bookId,
                        dueDate: loan.dueDate,
                        daysOverdue: daysOverdue,
                        timestamp: new Date()
                    }
                );
                this.notificationSystem.notify(notification.toDetails());
            }
        }
    }

    private isDateInRange(date: Date, start: Date, end: Date): boolean {
        const normalizedDate = new Date(date).setHours(0, 0, 0, 0);
        const normalizedStart = new Date(start).setHours(0, 0, 0, 0);
        const normalizedEnd = new Date(end).setHours(0, 0, 0, 0);
        return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
    }

    private getDaysUntil(date: Date): number {
        const diffTime = date.getTime() - new Date().getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    private getDaysSince(date: Date): number {
        const diffTime = new Date().getTime() - date.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}