import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReportService } from '../services/report.services';
import { LoanService } from '../services/loan.services';
import { UserService } from '../services/user.services';
import { BookService } from '../services/book.services';
import { LoanStatus } from '../models/loan.models';

describe('ReportService', () => {
    let reportService: ReportService;
    let loanService: LoanService;
    let userService: UserService;
    let bookService: BookService;

    beforeEach(() => {
        loanService = {
            getAllLoans: vi.fn()
        } as any;

        userService = {
            getAll: vi.fn()
        } as any;

        bookService = {
            getAll: vi.fn()
        } as any;

        reportService = new ReportService(loanService, userService, bookService);
    });

    describe('Active Loans Report', () => {
        it('should generate active loans report', async () => {
            const mockDate = new Date('2025-10-29');
            vi.setSystemTime(mockDate);

            const mockLoans = [
                {
                    id: '1',
                    bookId: 'book1',
                    userId: 'user1',
                    status: LoanStatus.ACTIVE,
                    dueDate: new Date('2025-11-01')
                },
                {
                    id: '2',
                    bookId: 'book2',
                    userId: 'user2',
                    status: LoanStatus.RETURNED,
                    dueDate: new Date('2025-10-28')
                }
            ];

            (loanService.getAllLoans as any).mockResolvedValue(mockLoans);

            const report = await reportService.getActiveLoansReport();

            expect(report.totalActiveLoans).toBe(1);
            expect(report.loans).toHaveLength(1);
            expect(report.loans[0].isOverdue).toBe(false);
        });
    });

    describe('Active Users Report', () => {
        it('should generate active users report', async () => {
            const mockUsers = [
                { id: 'user1', isActive: true },
                { id: 'user2', isActive: true },
                { id: 'user3', isActive: false }
            ];

            const mockLoans = [
                {
                    id: '1',
                    userId: 'user1',
                    status: LoanStatus.ACTIVE,
                    dueDate: new Date('2025-11-01')
                },
                {
                    id: '2',
                    userId: 'user1',
                    status: LoanStatus.ACTIVE,
                    dueDate: new Date('2025-10-28')
                }
            ];

            (userService.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockUsers);
            (loanService.getAllLoans as any).mockResolvedValue(mockLoans);

            const report = await reportService.getActiveUsersReport();

            expect(report.totalUsers).toBe(3);
            expect(report.activeUsers).toBe(2);
            expect(report.usersWithLoans).toBe(1);
        });
    });

    describe('Book Statistics Report', () => {
        it('should generate book statistics report', async () => {
            const mockBooks = [
                { id: 'book1' },
                { id: 'book2' },
                { id: 'book3' }
            ];

            const mockLoans = [
                {
                    id: '1',
                    bookId: 'book1',
                    status: LoanStatus.ACTIVE,
                    dueDate: new Date('2025-11-01')
                },
                {
                    id: '2',
                    bookId: 'book1',
                    status: LoanStatus.RETURNED
                },
                {
                    id: '3',
                    bookId: 'book2',
                    status: LoanStatus.ACTIVE,
                    dueDate: new Date('2025-10-28')
                }
            ];

            (bookService.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockBooks);
            (loanService.getAllLoans as any).mockResolvedValue(mockLoans);

            const report = await reportService.getBookStatisticsReport();

            expect(report.totalBooks).toBe(3);
            expect(report.availableBooks).toBe(1);
            expect(report.loanedBooks).toBe(2);
            expect(report.mostBorrowedBooks[0].bookId).toBe('book1');
            expect(report.mostBorrowedBooks[0].timesLoaned).toBe(2);
        });
    });
});