
import { Book, CreateBookDTO } from '../models/book.models'; 
import { isValidISBN } from '../utils/validators';
import { JsonDb } from '../data/jsonDb';

export class ValidatorError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidatorError';
    }
}

export class BookService {
    private db: JsonDb<Book>;
    private readonly validCategories = [
        'Novela', 'Poesia', 'Teatro', 'Ensayo', 'Biografia', 
        'Historia', 'Filosofia', 'Psicologia', 'Ciencias', 
        'Tecnologia', 'Arte', 'Infantil', 'Juvenil', 'Comic',
        'Referencia', 'Educacion'
    ];

    constructor() {
        this.db = new JsonDb<Book>('books.json');
        this.seedIfEmpty();
    }

    private async seedIfEmpty() {
        const books = await this.db.getAll();
        if (books.length === 0) {
            await this.db.add({
                id: '1',
                title: 'El Principito',
                author: 'Antoine de Saint-Exupéry',
                isbn: '9788498381498',
                category: 'Novela',
                description: 'Clásico.',
                available: true,
                timesLoaned: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            } as Book);
        }
    }

    async getAll(): Promise<Book[]> {
        return this.db.getAll();
    }

    async getById(id: string): Promise<Book | null> {
        return (await this.db.getById(id)) || null;
    }

    async create(bookData: CreateBookDTO): Promise<Book> {
        if (!isValidISBN(bookData.isbn)) throw new ValidatorError('ISBN invalido');
        if (!this.validCategories.includes(bookData.category)) throw new ValidatorError('Categoria invalida');
        if (!bookData.title.trim()) throw new ValidatorError('El titulo es requerido');
        
        // Construimos el objeto cumpliendo la interfaz Book
        const newBook: Book = {
            id: Date.now().toString(),
            title: bookData.title,
            author: bookData.author,
            isbn: bookData.isbn,
            category: bookData.category,
            description: bookData.description || '',
            available: true,
            timesLoaned: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return this.db.add(newBook);
    }

    async update(id: string, bookData: Partial<Book>): Promise<Book | null> {
        // Validar que no intenten cambiar el ISBN
        if (bookData.isbn !== undefined) {
            throw new ValidatorError('No se puede modificar el ISBN de un libro una vez creado');
        }

        // Validar categoría si se intenta cambiar
        if (bookData.category && !this.validCategories.includes(bookData.category)) {
            throw new ValidatorError(`Categoría inválida. Categorías válidas: ${this.validCategories.join(', ')}`);
        }

        // Validar título si se intenta cambiar
        if (bookData.title !== undefined && !bookData.title.trim()) {
            throw new ValidatorError('El título no puede estar vacío');
        }

        return this.db.update(id, { ...bookData, updatedAt: new Date() });
    }

    async delete(id: string): Promise<boolean> {
        return this.db.delete(id);
    }
}