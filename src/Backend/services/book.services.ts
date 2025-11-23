import { Book, CreateBookDTO } from '../models/book.models';
import { isValidISBN } from '../utils/validators';

export class ValidatorError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidatorError';
    }
}

export class BookService {
    // Almacenamiento en memoria (Array), igual que users y loans
    private books: Book[] = [];
    
    private readonly validCategories = [
        'Novela', 'Poesia', 'Teatro', 'Ensayo', 'Biografia', 
        'Historia', 'Filosofia', 'Psicologia', 'Ciencias', 
        'Tecnologia', 'Arte', 'Infantil', 'Juvenil', 'Comic',
        'Referencia', 'Educacion'
    ];

    constructor() {
        // (Opcional) Datos de prueba iniciales para no tener que crear libros cada vez
        this.seedInitialData();
    }

    private seedInitialData() {
        this.books.push({
            id: '1',
            title: 'El Principito',
            author: 'Antoine de Saint-Exupéry',
            isbn: '9788498381498',
            category: 'Novela',
            description: 'Clásico de la literatura.',
            available: true,
            timesLoaned: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    async getAll(): Promise<Book[]> {
        return this.books;
    }

    async getById(id: string): Promise<Book | null> {
        return this.books.find(book => book.id === id) || null;
    }

    async create(bookData: CreateBookDTO): Promise<Book> {
        // 1. Validaciones
        if (!isValidISBN(bookData.isbn)) {
            throw new ValidatorError('ISBN invalido');
        }
        if (!this.validCategories.includes(bookData.category)) {
            throw new ValidatorError('Categoria invalida');
        }
        if (!bookData.title.trim()) throw new ValidatorError('El titulo es requerido');
        if (!bookData.author.trim()) throw new ValidatorError('El autor es requerido');

        // 2. Crear libro
        const newBook: Book = {
            id: Date.now().toString(), // ID simple basado en tiempo
            title: bookData.title.trim(),
            author: bookData.author.trim(),
            isbn: bookData.isbn,
            category: bookData.category,
            description: bookData.description || '',
            available: true,
            timesLoaned: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.books.push(newBook);
        return newBook;
    }

    async update(id: string, bookData: Partial<Book>): Promise<Book | null> {
        const index = this.books.findIndex(b => b.id === id);
        if (index === -1) return null;

        const currentBook = this.books[index];

        // Validaciones solo si vienen los campos
        if (bookData.isbn && !isValidISBN(bookData.isbn)) {
            throw new ValidatorError('ISBN invalido');
        }
        if (bookData.category && !this.validCategories.includes(bookData.category)) {
            throw new ValidatorError('Categoria invalida');
        }

        // Actualizar
        const updatedBook = {
            ...currentBook,
            ...bookData,
            updatedAt: new Date()
        };

        this.books[index] = updatedBook;
        return updatedBook;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.books.findIndex(b => b.id === id);
        if (index === -1) return false;

        this.books.splice(index, 1);
        return true;
    }
}