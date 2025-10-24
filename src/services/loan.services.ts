import { Loan } from '../models/loan.models';
import { NotificationSystem } from '../patterns/observer/NotificationSystem';

export class LoanService {
    private loans: Loan[] = [];
    private notificationSystem: NotificationSystem;

    constructor(notificationSystem: NotificationSystem) {
        this.notificationSystem = notificationSystem;
    }

    async createLoan(userId: string, bookId: string): Promise<Loan> {
        const loan = new Loan(
            Date.now().toString(),
            userId,
            bookId,
            new Date(),
            new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
        );

        this.loans.push(loan);
        
        this.notificationSystem.notify({
            userId,
            message: `Book loan created. Due date: ${loan.dueDate.toLocaleDateString()}`,
            type: 'LOAN_DUE',
            createdAt: new Date()
        });

        return loan;
    }
}