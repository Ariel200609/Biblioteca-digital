import { Book } from '../models/book.models';

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
        
        const currentBook = this.books[index];
        if (!currentBook) return null;
        
        const updatedBook = new Book(
            currentBook.id,
            bookData.title || currentBook.title,
            bookData.author || currentBook.author,
            bookData.isbn || currentBook.isbn,
            bookData.category || currentBook.category
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