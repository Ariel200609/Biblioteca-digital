import { Request, Response } from 'express';
import { BookService } from '../services/book.services';

export class BookController {
    private bookService: BookService;

    constructor() {
        this.bookService = new BookService();
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const books = await this.bookService.getAll();
            res.json(books);
        } catch (error) {
            res.status(500).json({ error: 'Error getting books' });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'Book ID is required' });
            }
            const book = await this.bookService.getById(id);
            if (!book) return res.status(404).json({ error: 'Book not found' });
            res.json(book);
        } catch (error) {
            res.status(500).json({ error: 'Error getting user' });
        }
    };
    create = async (req: Request, res: Response) => {
        try {
            const book = await this.bookService.create(req.body);
            res.status(201).json(book);
        } catch (error) {
            res.status(400).json({ error: 'Error creating book' });
        }
    };
    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'Book ID is required' });
            }
            const book = await this.bookService.update(id, req.body);
            if (!book) return res.status(404).json({ error: 'Book not found' });
            res.json(book);
        } catch (error) {
            res.status(400).json({ error: 'Error updating user' });
        }
    };


    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'Book ID is required' });
            }
            const result = await this.bookService.delete(id);
            if (!result) return res.status(404).json({ error: 'Book not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Error deleting user' });
        }
    };
}