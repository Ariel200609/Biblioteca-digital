import { Book } from '../models/Book';

export class BookService {
    private books: Book[] = [];

    async getAll(): Promise<Book[]> {
        return this.books;
    }

    async getById(id: string): Promise<Book | null> {
        return this.books.find(book => book.id === id) || null;
    }

    async create(bookData: Omit<Book, 'id' | 'createdAt' | 'available'>): Promise<Book> {
        const book = new Book(
            Date.now().toString(),
            bookData.title,
            bookData.author,
            bookData.isbn,
            bookData.category
        );
        this.books.push(book);
        return book;
    }

    async update(id: string, bookData: Partial<Book>): Promise<Book | null> {
        const index = this.books.findIndex(book => book.id === id);
        if (index === -1) return null;
        
        this.books[index] = { ...this.books[index], ...bookData };
        return this.books[index];
    }

    async delete(id: string): Promise<boolean> {
        const index = this.books.findIndex(book => book.id === id);
        if (index === -1) return false;
        
        this.books.splice(index, 1);
        return true;
    }
}