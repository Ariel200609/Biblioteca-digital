import { Request, Response } from 'express';
import { BookService } from '../services/book.services';
import { 
    BookSearchStrategy,
    TitleSearchStrategy, 
    AuthorSearchStrategy, 
    CategorySearchStrategy, 
    PopularitySearchStrategy 
} from '../patterns/strategy/bookSearch.strategy';

export class BookController {
    private bookService: BookService;
    private readonly searchStrategies: { [key: string]: BookSearchStrategy };

    constructor() {
        this.bookService = new BookService();
        this.searchStrategies = {
            'title': new TitleSearchStrategy(),
            'author': new AuthorSearchStrategy(),
            'category': new CategorySearchStrategy(),
            'popularity': new PopularitySearchStrategy()
        };
    }

    public getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const books = await this.bookService.getAll();
            res.json(books);
        } catch (error) {
            res.status(500).json({ error: 'Error getting books' });
        }
    }

    public getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ error: 'Book ID is required' });
                return;
            }
            const book = await this.bookService.getById(id);
            if (!book) {
                res.status(404).json({ error: 'Book not found' });
                return;
            }
            res.json(book);
        } catch (error) {
            res.status(500).json({ error: 'Error getting book' });
        }
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const book = await this.bookService.create(req.body);
            res.status(201).json(book);
        } catch (error) {
            if (error instanceof Error && error.name === 'ValidatorError') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Error creating book' });
            }
        }
    }

    public search = async (req: Request, res: Response): Promise<void> => {
        try {
            const { type = 'title', query } = req.query;
            
            if (!query) {
                res.status(400).json({ error: 'Search query is required' });
                return;
            }

            const searchStrategy = this.searchStrategies[type as string];
            if (!searchStrategy) {
                res.status(400).json({ error: 'Invalid search type' });
                return;
            }

            const books = await this.bookService.getAll();
            const results = searchStrategy.search(books, query as string);
            res.json(results);
        } catch (error) {
            res.status(500).json({ error: 'Error searching books' });
        }
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ error: 'Book ID is required' });
                return;
            }
            const book = await this.bookService.update(id, req.body);
            if (!book) {
                res.status(404).json({ error: 'Book not found' });
                return;
            }
            res.json(book);
        } catch (error) {
            if (error instanceof Error && error.name === 'ValidatorError') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Error updating book' });
            }
        }
    }

    public remove = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ error: 'Book ID is required' });
                return;
            }
            const success = await this.bookService.delete(id);
            if (!success) {
                res.status(404).json({ error: 'Book not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Error deleting book' });
        }
    }
}