import { Loan, LoanStatus, CreateLoanDTO, LoanWithDetails } from '../models/loan.models';
import { NotificationSystem } from '../patterns/observer/notificationSystem';
import { LoanNotification } from '../patterns/observer/notificationTypes';
import { BookService } from './book.services';
import { UserService } from './user.services';

interface LoanEntity {
    id: string;
    userId: string;
    bookId: string;
    dueDate: Date;
    status: string;
    renewalCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export class LoanService {
    private loans: LoanEntity[] = [];
    private readonly LOAN_DURATION_DAYS = 14;
    private readonly MAX_RENEWALS = 2;

    constructor(
        private notificationSystem: NotificationSystem,
        private bookService: BookService,
        private userService: UserService
    ) {}

    // Helper method to serialize dates properly
    private serializeLoan(loan: LoanEntity): any {
        return {
            ...loan,
            dueDate: loan.dueDate instanceof Date ? loan.dueDate.toISOString() : loan.dueDate,
            createdAt: loan.createdAt instanceof Date ? loan.createdAt.toISOString() : loan.createdAt,
            updatedAt: loan.updatedAt instanceof Date ? loan.updatedAt.toISOString() : loan.updatedAt
        };
    }

    async createLoan(data: CreateLoanDTO): Promise<LoanEntity> {
        // Validate book availability
        const book = await this.bookService.getById(data.bookId);
        if (!book || !book.available) {
            throw new Error('Book is not available for loan');
        }

        // Validate user doesn't already have this book borrowed
        const userActiveLoans = await this.getActiveLoansForUser(data.userId);
        const alreadyBorrowed = userActiveLoans.some(loan => loan.bookId === data.bookId);
        if (alreadyBorrowed) {
            throw new Error('User already has this book on loan');
        }

        // Validate user can borrow more books
        if (userActiveLoans.length >= 3) {
            throw new Error('User has reached maximum number of active loans');
        }

        // Validate and convert dueDate to proper Date object
        let dueDate: Date;
        if (data.dueDate) {
            // Handle both ISO strings and Date objects
            const dateInput = typeof data.dueDate === 'string' ? data.dueDate : (data.dueDate instanceof Date ? data.dueDate.toISOString() : String(data.dueDate));
            dueDate = new Date(dateInput);
            if (isNaN(dueDate.getTime())) {
                throw new Error('Invalid dueDate format. Expected ISO 8601 date format.');
            }
        } else {
            dueDate = new Date(Date.now() + this.LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000);
        }

        // Ensure dueDate is in the future
        if (dueDate.getTime() <= Date.now()) {
            throw new Error('Due date must be in the future');
        }

        // Validate and convert loanDate to proper Date object (when the loan was made)
        let loanDate: Date;
        if (data.loanDate) {
            // Handle both ISO strings and Date objects
            const dateInput = typeof data.loanDate === 'string' ? data.loanDate : (data.loanDate instanceof Date ? data.loanDate.toISOString() : String(data.loanDate));
            loanDate = new Date(dateInput);
            if (isNaN(loanDate.getTime())) {
                throw new Error('Invalid loanDate format. Expected ISO 8601 date format.');
            }
        } else {
            loanDate = new Date();
        }

        const loan: LoanEntity = {
            id: Math.random().toString(36).substring(7),
            userId: data.userId,
            bookId: data.bookId,
            dueDate: dueDate,
            status: 'active',
            renewalCount: 0,
            createdAt: loanDate,
            updatedAt: loanDate
        };

        this.loans.push(loan);

        // Update book availability
        await this.bookService.update(data.bookId, { available: false });
        
        // Notify user
        const notification = new LoanNotification(
            data.userId,
            'LOAN_CREATED',
            `Book loan created. Due date: ${dueDate.toLocaleDateString()}`,
            {
                loanId: loan.id,
                bookId: loan.bookId,
                dueDate: dueDate,
                timestamp: new Date()
            }
        );
        this.notificationSystem.notify(notification.toDetails());

        return this.serializeLoan(loan);
    }

    async getLoanById(id: string): Promise<any | null> {
        const loan = this.loans.find(l => l.id === id) || null;
        return loan ? this.serializeLoan(loan) : null;
    }

    async getAllLoans(): Promise<any[]> {
        return this.loans.map(loan => this.serializeLoan(loan));
    }

    async getActiveLoansForUser(userId: string): Promise<any[]> {
        return this.loans
            .filter(loan => 
                loan.userId === userId && 
                loan.status === 'active'
            )
            .map(loan => this.serializeLoan(loan));
    }

    async returnLoan(id: string): Promise<any | null> {
        const loan = this.loans.find(l => l.id === id);
        if (!loan || loan.status === 'returned') return null;

        loan.status = 'returned';
        loan.updatedAt = new Date();

        // Make book available again
        await this.bookService.update(loan.bookId, { available: true });

        const notification = new LoanNotification(
            loan.userId,
            'LOAN_RETURNED',
            'Book returned successfully',
            {
                loanId: loan.id,
                bookId: loan.bookId,
                dueDate: loan.dueDate,
                timestamp: new Date()
            }
        );
        this.notificationSystem.notify(notification.toDetails());

        return this.serializeLoan(loan);
    }

    async renewLoan(id: string): Promise<any | null> {
        const loan = this.loans.find(l => l.id === id);
        if (!loan || loan.status !== 'active') return null;

        if (loan.renewalCount >= this.MAX_RENEWALS) {
            throw new Error('Maximum number of renewals reached');
        }

        if (new Date() > loan.dueDate) {
            throw new Error('Overdue loans cannot be renewed');
        }

        loan.dueDate = new Date(Date.now() + this.LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000);
        loan.renewalCount++;
        loan.updatedAt = new Date();

        const notification = new LoanNotification(
            loan.userId,
            'LOAN_RENEWED',
            `Loan renewed. New due date: ${loan.dueDate.toLocaleDateString()}`,
            {
                loanId: loan.id,
                bookId: loan.bookId,
                dueDate: loan.dueDate,
                timestamp: new Date()
            }
        );
        this.notificationSystem.notify(notification.toDetails());

        return this.serializeLoan(loan);
    }

    private calculateDaysOverdue(dueDate: Date): number {
        const today = new Date();
        const diffTime = today.getTime() - dueDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // metodo para verificar prestamos vencidos
    async checkOverdueLoans(): Promise<void> {
        const now = new Date();
        
        for (const loan of this.loans) {
            if (loan.status === 'active' && now > loan.dueDate) {
                loan.status = 'overdue';
                
                const notification = new LoanNotification(
                    loan.userId,
                    'LOAN_OVERDUE',
                    'Your loan is overdue. Please return the book as soon as possible.',
                    {
                        loanId: loan.id,
                        bookId: loan.bookId,
                        dueDate: loan.dueDate,
                        daysOverdue: this.calculateDaysOverdue(loan.dueDate),
                        timestamp: new Date()
                    }
                );
                this.notificationSystem.notify(notification.toDetails());
            }
        }
    }
}
