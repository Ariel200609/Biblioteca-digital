import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoanService } from '../services/loan.services';
import { BookService } from '../services/book.services';
import { UserService } from '../services/user.services';
import { NotificationSystem } from '../patterns/observer/notificationSystem';
import { CreateLoanDTO, LoanStatus } from '../models/loan.models';

// Mock dependencies
vi.mock('../services/book.services');
vi.mock('../services/user.services');
vi.mock('../patterns/observer/notificationSystem');

describe('LoanService', () => {
    let loanService: LoanService;
    let bookService: BookService;
    let userService: UserService;
    let notificationSystem: NotificationSystem;

    beforeEach(() => {
        // Clear all mocks
        vi.clearAllMocks();

        // Setup mock services
        bookService = {
            getById: vi.fn(),
            update: vi.fn()
        } as any;

        userService = {
            getById: vi.fn()
        } as any;

        notificationSystem = {
            notify: vi.fn()
        } as any;

        // Setup test data
        const testUser = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'reader',
            isActive: true
        };

        // Create the loan service with mock dependencies
        loanService = new LoanService(notificationSystem, bookService, userService);

        // Setup default mock implementations
        (bookService.getById as any).mockResolvedValue({
            id: '1',
            title: 'Test Book',
            author: 'Test Author',
            isbn: '1234567890',
            category: 'Test Category',
            description: 'Test Description',
            available: true,
            timesLoaned: 0
        });

        (userService.getById as any).mockResolvedValue({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'reader',
            isActive: true
        });

        (notificationSystem.notify as any).mockImplementation(() => {});
    });

    describe('createLoan', () => {
        it('should create a loan when book is available', async () => {
            const loanData: CreateLoanDTO = {
                userId: '1',
                bookId: '1',
                dueDate: new Date('2025-12-31')
            };

            const loan = await loanService.createLoan(loanData);

            expect(loan).toMatchObject({
                userId: '1',
                bookId: '1',
                status: LoanStatus.ACTIVE,
                renewalCount: 0
            });
            expect(bookService.update).toHaveBeenCalledWith('1', { available: false });
            expect(notificationSystem.notify).toHaveBeenCalled();
        });

        it('should throw error when book is not available', async () => {
            (bookService.getById as any).mockResolvedValue({
                id: '1',
                title: 'Test Book',
                available: false
            });

            const loanData: CreateLoanDTO = {
                userId: '1',
                bookId: '1',
                dueDate: new Date('2025-12-31')
            };

            await expect(loanService.createLoan(loanData)).rejects.toThrow('Book is not available');
        });

        it('should throw error when user has too many active loans', async () => {
            // Mock getActiveLoansForUser to return 3 active loans
            const mockActiveLoans = Array(3).fill({
                id: '1',
                userId: '1',
                status: LoanStatus.ACTIVE
            });

            // @ts-ignore - mock implementation
            loanService.getActiveLoansForUser = vi.fn().mockResolvedValue(mockActiveLoans);

            const loanData: CreateLoanDTO = {
                userId: '1',
                bookId: '1',
                dueDate: new Date('2025-12-31')
            };

            await expect(loanService.createLoan(loanData)).rejects.toThrow('maximum number of active loans');
        });
    });

    describe('returnLoan', () => {
        it('should return a loan successfully', async () => {
            // Setup: Create a loan first
            const loanData: CreateLoanDTO = {
                userId: '1',
                bookId: '1',
                dueDate: new Date('2025-12-31')
            };
            const loan = await loanService.createLoan(loanData);

            const returnedLoan = await loanService.returnLoan(loan.id);

            expect(returnedLoan?.status).toBe(LoanStatus.RETURNED);
            expect(returnedLoan?.status).toBe(LoanStatus.RETURNED);
            expect(bookService.update).toHaveBeenCalledWith('1', { available: true });
            expect(notificationSystem.notify).toHaveBeenCalled();
        });
    });

    describe('renewLoan', () => {
        it('should renew a loan successfully', async () => {
            // Setup: Create a loan first
            const loanData: CreateLoanDTO = {
                userId: '1',
                bookId: '1',
                dueDate: new Date('2025-12-31')
            };
            const loan = await loanService.createLoan(loanData);

            const renewedLoan = await loanService.renewLoan(loan.id);

            expect(renewedLoan?.renewalCount).toBe(1);
            expect(renewedLoan?.status).toBe(LoanStatus.ACTIVE);
            expect(notificationSystem.notify).toHaveBeenCalled();
        });

        it('should not renew an overdue loan', async () => {
            // Setup: Create a loan with past due date
            const loanData: CreateLoanDTO = {
                userId: '1',
                bookId: '1',
                dueDate: new Date('2020-01-01')
            };
            const loan = await loanService.createLoan(loanData);

            await expect(loanService.renewLoan(loan.id)).rejects.toThrow('Overdue loans cannot be renewed');
        });

        it('should not renew beyond maximum renewals', async () => {
            // Setup: Create and renew loan twice
            const loanData: CreateLoanDTO = {
                userId: '1',
                bookId: '1',
                dueDate: new Date('2025-12-31')
            };
            const loan = await loanService.createLoan(loanData);
            await loanService.renewLoan(loan.id);
            await loanService.renewLoan(loan.id);

            await expect(loanService.renewLoan(loan.id)).rejects.toThrow('Maximum number of renewals reached');
        });
    });
});