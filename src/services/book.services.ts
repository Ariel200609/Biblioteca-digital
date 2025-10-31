import { Book } from '../models/book.models';
import { isValidISBN } from '../utils/validators';

export class ValidatorError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidatorError';
    }
}

export class BookService {
    private books: Book[] = [];
    private readonly validCategories = [
        'Novela', 'Poesia', 'Teatro', 'Ensayo', 'Biografia', 
        'Historia', 'Filosofia', 'Psicologia', 'Ciencias', 
        'Tecnologia', 'Arte', 'Infantil', 'Juvenil', 'Comic',
        'Referencia', 'Educacion'
    ];

    async getAll(): Promise<Book[]> {
        return this.books;
    }

    async getById(id: string): Promise<Book | null> {
        return this.books.find(book => book.id === id) || null;
    }

    async create(bookData: Omit<Book, 'id' | 'createdAt' | 'available'>): Promise<Book> {
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

        const book = new Book(
            Date.now().toString(),
            bookData.title.trim(),
            bookData.author.trim(),
            bookData.isbn,
            bookData.category
        );
        this.books.push(book);
        return book;
    }

    async update(id: string, bookData: Partial<Book>): Promise<Book | null> {
        const index = this.books.findIndex(book => book.id === id);
        if (index === -1) return null;
        const currentBook = this.books[index];
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

        const updatedBook = new Book(
            currentBook.id,
            bookData.title?.trim() || currentBook.title,
            bookData.author?.trim() || currentBook.author,
            bookData.isbn || currentBook.isbn,
            bookData.category || currentBook.category,
            bookData.available !== undefined ? bookData.available : currentBook.available
        );
        
        this.books[index] = updatedBook;
        return updatedBook;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.books.findIndex(book => book.id === id);
        if (index === -1) return false;
        
        this.books.splice(index, 1);
        return true;
    }
}