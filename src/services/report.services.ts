import { LoanService } from './loan.services';
import { UserService } from './user.services';
import { BookService } from './book.services';
import { LoanStatus } from '../models/loan.models';

// Interfaces for different report types
export interface ActiveLoansReport {
    totalActiveLoans: number;
    loans: Array<{
        loanId: string;
        bookId: string;
        userId: string;
        dueDate: Date;
        isOverdue: boolean;
    }>;
}

export interface ActiveUsersReport {
    totalUsers: number;
    activeUsers: number;
    usersWithLoans: number;
    usersWithOverdueLoans: number;
}

export interface BookStatisticsReport {
    totalBooks: number;
    availableBooks: number;
    loanedBooks: number;
    mostBorrowedBooks: Array<{
        bookId: string;
        timesLoaned: number;
    }>;
    overdueBooks: number;
}

export class ReportService {
    constructor(
        private loanService: LoanService,
        private userService: UserService,
        private bookService: BookService
    ) {}

    async getActiveLoansReport(): Promise<ActiveLoansReport> {
        const loans = await this.loanService.getAllLoans();
        const activeLoans = loans.filter((loan: { status: LoanStatus; dueDate: Date; id: string; bookId: string; userId: string }) => 
            loan.status === LoanStatus.ACTIVE
        );
        const now = new Date();

        return {
            totalActiveLoans: activeLoans.length,
            loans: activeLoans.map(loan => ({
                loanId: loan.id,
                bookId: loan.bookId,
                userId: loan.userId,
                dueDate: loan.dueDate,
                isOverdue: loan.dueDate < now
            }))
        };
    }

    async getActiveUsersReport(): Promise<ActiveUsersReport> {
        const [users, loans] = await Promise.all([
            this.userService.getAll(),
            this.loanService.getAllLoans()
        ]);

        const now = new Date();
        const activeLoans = loans.filter(loan => loan.status === LoanStatus.ACTIVE);
        const overdueLoans = activeLoans.filter(loan => loan.dueDate < now);

        // Get unique user IDs with active loans
        const usersWithLoans = new Set(activeLoans.map(loan => loan.userId));
        const usersWithOverdueLoans = new Set(overdueLoans.map(loan => loan.userId));

        return {
            totalUsers: users.length,
            activeUsers: users.filter(user => user.isActive).length,
            usersWithLoans: usersWithLoans.size,
            usersWithOverdueLoans: usersWithOverdueLoans.size
        };
    }

    async getBookStatisticsReport(): Promise<BookStatisticsReport> {
        const [books, loans] = await Promise.all([
            this.bookService.getAll(),
            this.loanService.getAllLoans()
        ]);

        const activeLoans = loans.filter(loan => loan.status === LoanStatus.ACTIVE);
        const now = new Date();
        const overdueLoans = activeLoans.filter(loan => loan.dueDate < now);

        // Count times each book has been loaned
        const bookLoanCount = new Map<string, number>();
        loans.forEach(loan => {
            const count = bookLoanCount.get(loan.bookId) || 0;
            bookLoanCount.set(loan.bookId, count + 1);
        });

        // Get most borrowed books (top 5)
        const mostBorrowed = Array.from(bookLoanCount.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([bookId, timesLoaned]) => ({ bookId, timesLoaned }));

        return {
            totalBooks: books.length,
            availableBooks: books.length - activeLoans.length,
            loanedBooks: activeLoans.length,
            mostBorrowedBooks: mostBorrowed,
            overdueBooks: overdueLoans.length
        };
    }
}