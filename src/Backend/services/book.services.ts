import { Book } from '../../Database/entities/Book.entity';
import { isValidISBN } from '../utils/validators';
import { AppDataSource } from '../../Database/config/database.config';
import { Repository } from 'typeorm';

export class ValidatorError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidatorError';
    }
}

export class BookService {
    private bookRepository: Repository<Book>;
    private readonly validCategories = [
        'Novela', 'Poesia', 'Teatro', 'Ensayo', 'Biografia', 
        'Historia', 'Filosofia', 'Psicologia', 'Ciencias', 
        'Tecnologia', 'Arte', 'Infantil', 'Juvenil', 'Comic',
        'Referencia', 'Educacion'
    ];

    constructor() {
        this.bookRepository = AppDataSource.getRepository(Book);
    }

    async getAll(): Promise<Book[]> {
        return this.bookRepository.find();
    }

    async getById(id: string): Promise<Book | null> {
        return this.bookRepository.findOneBy({ id });
    }

    async create(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'available' | 'borrowCount'>): Promise<Book> {
        // Validar ISBN
        if (!isValidISBN(bookData.isbn)) {
            throw new ValidatorError('ISBN invalido');
        }

        // Validar categoría
        if (!this.validCategories.includes(bookData.category)) {
            throw new ValidatorError('Categoria invalida');
        }

        // Validar datos requeridos
        if (!bookData.title.trim()) {
            throw new ValidatorError('El titulo es requerido');
        }
        if (!bookData.author.trim()) {
            throw new ValidatorError('El autor es requerido');
        }

        const book = new Book();
        book.title = bookData.title.trim();
        book.author = bookData.author.trim();
        book.isbn = bookData.isbn;
        book.category = bookData.category;

        return this.bookRepository.save(book);
    }

    async update(id: string, bookData: Partial<Book>): Promise<Book | null> {
        const currentBook = await this.bookRepository.findOneBy({ id });
        if (!currentBook) return null;
        
        // Validar ISBN si se está actualizando
        if (bookData.isbn && !isValidISBN(bookData.isbn)) {
            throw new ValidatorError('ISBN invalido');
        }

        // Validar categoría si se está actualizando
        if (bookData.category && !this.validCategories.includes(bookData.category)) {
            throw new ValidatorError('Categoria invalida');
        }

        // Validar título si se está actualizando
        if (bookData.title && !bookData.title.trim()) {
            throw new ValidatorError('El titulo es requerido');
        }

        // Validar autor si se está actualizando
        if (bookData.author && !bookData.author.trim()) {
            throw new ValidatorError('El autor es requerido');
        }

        const updatedBook = this.bookRepository.merge(currentBook, {
            ...bookData,
            title: bookData.title?.trim() || currentBook.title,
            author: bookData.author?.trim() || currentBook.author
        });
        
        return this.bookRepository.save(updatedBook);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.bookRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}