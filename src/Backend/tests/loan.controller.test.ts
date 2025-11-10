import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { LoanController } from '../controllers/loan.controllers';
import { LoanService } from '../services/loan.services';
import { LoanStatus } from '../models/loan.models';

// Mock LoanService
vi.mock('../services/loan.services');

describe('LoanController', () => {
    let loanController: LoanController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        // Clear all mocks
        vi.clearAllMocks();

        const loanService = new LoanService(null as any, null as any, null as any);
        loanController = new LoanController(loanService);

        // Reset response mock
        mockResponse = {
            json: vi.fn().mockReturnThis(),
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        };

        // Reset request mock
        mockRequest = {};
    });

    describe('getAll', () => {
        it('should return all loans', async () => {
            const mockLoans = [
                {
                    id: '1',
                    userId: '1',
                    bookId: '1',
                    status: LoanStatus.ACTIVE,
                    dueDate: new Date(),
                    loanDate: new Date(),
                    returnDate: null,
                    renewalCount: 0,
                    user: {
                        id: '1',
                        name: 'Test User',
                        email: 'test@example.com',
                        role: 'reader',
                        isActive: true,
                        activeLoans: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    book: {
                        id: '1',
                        title: 'Test Book',
                        author: 'Test Author',
                        isbn: '1234567890',
                        category: 'Test Category',
                        description: 'Test Description',
                        available: true,
                        timesLoaned: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: '2',
                    userId: '2',
                    bookId: '2',
                    status: LoanStatus.RETURNED,
                    dueDate: new Date(),
                    loanDate: new Date(),
                    returnDate: new Date(),
                    renewalCount: 0,
                    user: {
                        id: '2',
                        name: 'Test User 2',
                        email: 'test2@example.com',
                        role: 'reader',
                        isActive: true,
                        activeLoans: 0,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    book: {
                        id: '2',
                        title: 'Test Book 2',
                        author: 'Test Author 2',
                        isbn: '0987654321',
                        category: 'Test Category',
                        description: 'Test Description',
                        available: true,
                        timesLoaned: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            // Mock service response
            (LoanService as any).prototype.getAllLoans.mockResolvedValue(mockLoans);

            await loanController.getAll(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(mockLoans);
        });

        it('should handle errors', async () => {
            // Mock service error
            (LoanService as any).prototype.getAllLoans.mockRejectedValue(new Error('Database error'));

            await loanController.getAll(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error getting loans' });
        });
    });

    describe('create', () => {
        it('should create a new loan', async () => {
            const mockLoanData = {
                userId: '1',
                bookId: '1',
                dueDate: new Date('2025-12-31')
            };

            const mockCreatedLoan = {
                id: '1',
                ...mockLoanData,
                status: LoanStatus.ACTIVE,
                loanDate: new Date(),
                renewalCount: 0
            };

            mockRequest.body = mockLoanData;

            // Mock service response
            (LoanService as any).prototype.createLoan.mockResolvedValue(mockCreatedLoan);

            await loanController.create(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedLoan);
        });

        it('should handle validation errors', async () => {
            mockRequest.body = {
                userId: '1',
                bookId: '1'
            };

            // Mock service error
            (LoanService as any).prototype.createLoan.mockRejectedValue(new Error('Book is not available'));

            await loanController.create(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Book is not available' });
        });
    });

    describe('returnLoan', () => {
        it('should return a loan successfully', async () => {
            const mockLoan = {
                id: '1',
                userId: '1',
                bookId: '1',
                status: LoanStatus.RETURNED,
                returnDate: new Date()
            };

            mockRequest.params = { id: '1' };

            // Mock service response
            (LoanService as any).prototype.returnLoan.mockResolvedValue(mockLoan);

            await loanController.returnLoan(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(mockLoan);
        });

        it('should handle non-existent loan', async () => {
            mockRequest.params = { id: '999' };

            // Mock service response
            (LoanService as any).prototype.returnLoan.mockResolvedValue(null);

            await loanController.returnLoan(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Loan not found' });
        });
    });

    describe('renewLoan', () => {
        it('should renew a loan successfully', async () => {
            const mockLoan = {
                id: '1',
                userId: '1',
                bookId: '1',
                status: LoanStatus.ACTIVE,
                renewalCount: 1
            };

            mockRequest.params = { id: '1' };

            // Mock service response
            (LoanService as any).prototype.renewLoan.mockResolvedValue(mockLoan);

            await loanController.renewLoan(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(mockLoan);
        });

        it('should handle renewal errors', async () => {
            mockRequest.params = { id: '1' };

            // Mock service error
            (LoanService as any).prototype.renewLoan.mockRejectedValue(
                new Error('Maximum number of renewals reached')
            );

            await loanController.renewLoan(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ 
                error: 'Maximum number of renewals reached' 
            });
        });
    });
});