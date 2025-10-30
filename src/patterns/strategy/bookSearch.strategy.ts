import { Book } from '../models/book.models';

// Strategy interface
export interface BookSearchStrategy {
    search(books: Book[], query: string): Book[];
}

// Concrete strategies
export class TitleSearchStrategy implements BookSearchStrategy {
    search(books: Book[], query: string): Book[] {
        return books.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase())
        );
    }
}

export class AuthorSearchStrategy implements BookSearchStrategy {
    search(books: Book[], query: string): Book[] {
        return books.filter(book => 
            book.author.toLowerCase().includes(query.toLowerCase())
        );
    }
}

export class PopularitySearchStrategy implements BookSearchStrategy {
    search(books: Book[], _query: string): Book[] {
        return [...books].sort((a, b) => 
            (b.borrowCount || 0) - (a.borrowCount || 0)
        ).slice(0, 10); // Return top 10 most borrowed books
    }
}

// Context
export class BookSearchContext {
    private strategy: BookSearchStrategy;

    constructor(strategy: BookSearchStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: BookSearchStrategy) {
        this.strategy = strategy;
    }

    executeSearch(books: Book[], query: string): Book[] {
        return this.strategy.search(books, query);
    }
}

// Factory for creating strategies
export class SearchStrategyFactory {
    static createStrategy(type: 'title' | 'author' | 'popularity'): BookSearchStrategy {
        switch (type) {
            case 'title':
                return new TitleSearchStrategy();
            case 'author':
                return new AuthorSearchStrategy();
            case 'popularity':
                return new PopularitySearchStrategy();
            default:
                throw new Error('Invalid search strategy type');
        }
    }
}