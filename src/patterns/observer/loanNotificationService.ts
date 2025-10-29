import { LoanService } from '../../services/loan.services';
import { NotificationSystem } from './notificationSystem';
import { LoanStatus } from '../../models/loan.models';

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
                this.notificationSystem.notify({
                    userId: loan.userId,
                    message: `Your loan for book ID ${loan.bookId} is due in ${
                        this.getDaysUntil(loan.dueDate)
                    } days. Please return it or renew if possible.`,
                    type: 'LOAN_DUE',
                    createdAt: new Date(),
                    metadata: {
                        loanId: loan.id,
                        dueDate: loan.dueDate,
                        daysRemaining: this.getDaysUntil(loan.dueDate)
                    }
                });
            }

            // Notificar préstamos vencidos
            if (loan.dueDate < today) {
                this.notificationSystem.notify({
                    userId: loan.userId,
                    message: `Your loan for book ID ${loan.bookId} is overdue by ${
                        this.getDaysSince(loan.dueDate)
                    } days. Please return it as soon as possible.`,
                    type: 'LOAN_OVERDUE',
                    createdAt: new Date(),
                    metadata: {
                        loanId: loan.id,
                        dueDate: loan.dueDate,
                        daysOverdue: this.getDaysSince(loan.dueDate)
                    }
                });
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