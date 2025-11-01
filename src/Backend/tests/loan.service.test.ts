import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest';
import { LoanService } from '../services/loan.services';
import { BookService } from '../services/book.services';
import { UserService } from '../services/user.services';
import { NotificationSystem } from '../patterns/observer/notificationSystem';
import { CreateLoanDTO, LoanStatus } from '../dtos/loan.dto';
import { TestDataSource } from '../../Database/config/database.test.config';
import { Book } from '../../Database/entities/Book.entity';
import { User } from '../../Database/entities/User.entity';
import { Loan } from '../../Database/entities/Loan.entity';

// Mock dependencies
vi.mock('../services/book.services');
vi.mock('../services/user.services');
vi.mock('../patterns/observer/notificationSystem');

describe('LoanService', () => {
    let loanService: LoanService;
    let bookService: BookService;
    let userService: UserService;
    let notificationSystem: NotificationSystem;

    beforeAll(async () => {
        await TestDataSource.initialize();
    });

    afterAll(async () => {
        await TestDataSource.destroy();
    });

    beforeEach(async () => {
        // Clear all mocks and database
        vi.clearAllMocks();
        await TestDataSource.synchronize(true);

        // Crear usuario y libro en la base de datos de prueba
        const userRepo = TestDataSource.getRepository(User);
        const bookRepo = TestDataSource.getRepository(Book);

        await userRepo.save({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'reader',
            isActive: true,
            activeLoans: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await bookRepo.save({
            id: '1',
            title: 'Test Book',
            author: 'Test Author',
            isbn: '1234567890',
            category: 'Test Category',
            description: 'Test Description',
            available: true,
            timesLoaned: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Create fresh instances
        bookService = new BookService();
        userService = new UserService();
        notificationSystem = new NotificationSystem();
        loanService = new LoanService(notificationSystem, bookService, userService);

        // Configurar el repositorio para usar la base de datos de prueba
        (loanService as any).loanRepository = TestDataSource.getRepository(Loan);

        // Setup default mock implementations
        (bookService.getById as any).mockResolvedValue({
            id: '1',
            title: 'Test Book',
            author: 'Test Author',
            isbn: '1234567890',
            category: 'Test Category',
            description: 'Test Description',
            available: true,
            timesLoaned: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        (userService.getById as any).mockResolvedValue({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'reader',
            isActive: true,
            activeLoans: 0,
            createdAt: new Date(),
            updatedAt: new Date()
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