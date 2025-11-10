import { Loan, LoanStatus, CreateLoanDTO, LoanWithDetails } from '../models/loan.models';
import { NotificationSystem } from '../patterns/observer/notificationSystem';
import { LoanNotification } from '../patterns/observer/notificationTypes';
import { BookService } from './book.services';
import { UserService } from './user.services';

export class LoanService {
    private loans: Loan[] = [];
    private readonly LOAN_DURATION_DAYS = 14;
    private readonly MAX_RENEWALS = 2;
    private nextId = 1;

    constructor(
        private notificationSystem: NotificationSystem,
        private bookService: BookService,
        private userService: UserService
    ) {}

    async createLoan(data: CreateLoanDTO): Promise<Loan> {
        // Validate book availability
        const book = await this.bookService.getById(data.bookId);
        if (!book || !book.available) {
            throw new Error('Book is not available for loan');
        }

        // Validate user can borrow
        const userActiveLoans = await this.getActiveLoansForUser(data.userId);
        if (userActiveLoans.length >= 3) {
            throw new Error('User has reached maximum number of active loans');
        }

        const loan: Loan = {
            id: this.nextId.toString(),
            userId: data.userId,
            bookId: data.bookId,
            loanDate: new Date(),
            dueDate: data.dueDate || new Date(Date.now() + this.LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000),
            status: LoanStatus.ACTIVE,
            renewalCount: 0
        };

        this.nextId++;
        this.loans.push(loan);

        // Update book availability
        await this.bookService.update(data.bookId, { available: false });
        
        // Notify user using the new LoanNotification
        const notification = new LoanNotification(
            data.userId,
            'LOAN_CREATED',
            `Book loan created. Due date: ${loan.dueDate.toLocaleDateString()}`,
            {
                loanId: loan.id,
                bookId: loan.bookId,
                dueDate: loan.dueDate,
                timestamp: new Date()
            }
        );
        this.notificationSystem.notify(notification.toDetails());

        return loan;
    }

    async getLoanById(id: string): Promise<LoanWithDetails | null> {
        const loan = this.loans.find(l => l.id === id);
        if (!loan) return null;

        return this.enrichLoanWithDetails(loan);
    }

    async getAllLoans(): Promise<Loan[]> {
        return this.loans;
    }

    async getActiveLoansForUser(userId: string): Promise<Loan[]> {
        return this.loans.filter(loan => 
            loan.userId === userId && 
            loan.status === LoanStatus.ACTIVE
        );
    }

    async returnLoan(id: string): Promise<Loan | null> {
        const loan = this.loans.find(l => l.id === id);
        if (!loan || loan.status === LoanStatus.RETURNED) return null;

        loan.status = LoanStatus.RETURNED;
        loan.returnDate = new Date();

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

        return loan;
    }

    async renewLoan(id: string): Promise<Loan | null> {
        const loan = this.loans.find(l => l.id === id);
        if (!loan || loan.status !== LoanStatus.ACTIVE) return null;

        if (loan.renewalCount >= this.MAX_RENEWALS) {
            throw new Error('Maximum number of renewals reached');
        }

        if (new Date() > loan.dueDate) {
            throw new Error('Overdue loans cannot be renewed');
        }

        loan.dueDate = new Date(Date.now() + this.LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000);
        loan.renewalCount++;

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

        return loan;
    }

    private calculateDaysOverdue(dueDate: Date): number {
        const today = new Date();
        const diffTime = today.getTime() - dueDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    private async enrichLoanWithDetails(loan: Loan): Promise<LoanWithDetails> {
        const [book, user] = await Promise.all([
            this.bookService.getById(loan.bookId),
            this.userService.getById(loan.userId)
        ]);

        return {
            ...loan,
            returned: loan.status === LoanStatus.RETURNED,
            book: book ? { title: book.title, author: book.author } : undefined,
            user: user ? { name: user.name, email: user.email } : undefined,
            createdAt: loan.loanDate
        };
    }

    // metodo para verificar prestamos vencidos
    async checkOverdueLoans(): Promise<void> {
        const now = new Date();
        
        const activeLoans = this.loans.filter(loan => loan.status === LoanStatus.ACTIVE);
        
        for (const loan of activeLoans) {
            if (now > loan.dueDate) {
                loan.status = LoanStatus.OVERDUE;
                
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