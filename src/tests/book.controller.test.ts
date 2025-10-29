import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { BookController } from '../controllers/book.controllers';
import { BookService } from '../services/book.services';

// Mock BookService
vi.mock('../services/book.services', () => ({
    BookService: vi.fn().mockImplementation(() => ({
        getAll: vi.fn(),
        getById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
    }))
}));

describe('BookController', () => {
    let bookController: BookController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
        bookController = new BookController();
        responseObject = {};

        // Reset response mock
        mockResponse = {
            json: vi.fn().mockImplementation(result => {
                responseObject = result;
                return mockResponse;
            }),
            status: vi.fn().mockReturnThis(),
            send: vi.fn()
        };
    });

    describe('getAll', () => {
        it('should return all books', async () => {
            const mockBooks = [
                { id: '1', title: 'Book 1', author: 'Author 1' },
                { id: '2', title: 'Book 2', author: 'Author 2' }
            ];

            // Mock service response
            (BookService as any).mock.results[0].value.getAll.mockResolvedValue(mockBooks);

            await bookController.getAll(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
        });

        it('should handle errors', async () => {
            // Mock service error
            (BookService as any).mock.results[0].value.getAll.mockRejectedValue(new Error('Database error'));

            await bookController.getAll(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error getting books' });
        });
    });

    describe('getById', () => {
        it('should return a book by id', async () => {
            const mockBook = { id: '1', title: 'Book 1', author: 'Author 1' };
            mockRequest = { params: { id: '1' } };

            (BookService as any).mock.results[0].value.getById.mockResolvedValue(mockBook);

            await bookController.getById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
        });

        it('should return 404 if book not found', async () => {
            mockRequest = { params: { id: '999' } };

            (BookService as any).mock.results[0].value.getById.mockResolvedValue(null);

            await bookController.getById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Book not found' });
        });
    });
});