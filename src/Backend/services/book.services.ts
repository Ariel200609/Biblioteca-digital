import { isValidISBN } from '../utils/validators';

interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    description: string;
    available: boolean;
    borrowCount: number;
    timesLoaned: number;
    createdAt: Date;
    updatedAt: Date;
}

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

    constructor() {}

    async getAll(): Promise<Book[]> {
        return this.books;
    }

    async getById(id: string): Promise<Book | null> {
        return this.books.find(b => b.id === id) || null;
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

        const book: Book = {
            id: Math.random().toString(36).substring(7),
            title: bookData.title.trim(),
            author: bookData.author.trim(),
            isbn: bookData.isbn,
            category: bookData.category,
            description: bookData.description,
            available: true,
            borrowCount: 0,
            timesLoaned: bookData.timesLoaned || 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.books.push(book);
        return book;
    }

    async update(id: string, bookData: Partial<Book>): Promise<Book | null> {
        const currentBook = this.books.find(b => b.id === id);
        if (!currentBook) return null;
        // Bloquear actualización de ISBN
        if (bookData.isbn && bookData.isbn !== currentBook.isbn) {
            throw new ValidatorError('No se puede cambiar el ISBN de un libro');
        }

        // Bloquear actualización de ID
        if (bookData.id && bookData.id !== currentBook.id) {
            throw new ValidatorError('No se puede cambiar el ID de un libro');
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

        // Actualizar campos
        if (bookData.title) currentBook.title = bookData.title.trim();
        if (bookData.author) currentBook.author = bookData.author.trim();
        if (bookData.category) currentBook.category = bookData.category;
        if (bookData.available !== undefined) currentBook.available = bookData.available;
        currentBook.updatedAt = new Date();

        return currentBook;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.books.findIndex(b => b.id === id);
        if (index === -1) return false;
        this.books.splice(index, 1);
        return true;
    }
}