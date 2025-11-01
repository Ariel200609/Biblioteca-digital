import { Book } from '../../../Database/entities/Book.entity';

// Strategy interface
export interface BookSearchStrategy {
    search(books: Book[], query: string): Book[];
    getDescription(): string;
}

// Concrete strategies
export class TitleSearchStrategy implements BookSearchStrategy {
    search(books: Book[], query: string): Book[] {
        const normalizedQuery = query.toLowerCase().trim();
        return books.filter(book => 
            book.title.toLowerCase().includes(normalizedQuery)
        );
    }

    getDescription(): string {
        return "Búsqueda por título del libro";
    }
}

export class AuthorSearchStrategy implements BookSearchStrategy {
    search(books: Book[], query: string): Book[] {
        const normalizedQuery = query.toLowerCase().trim();
        return books.filter(book => 
            book.author.toLowerCase().includes(normalizedQuery)
        );
    }

    getDescription(): string {
        return "Búsqueda por autor del libro";
    }
}

export class CategorySearchStrategy implements BookSearchStrategy {
    search(books: Book[], query: string): Book[] {
        const normalizedQuery = query.toLowerCase().trim();
        return books.filter(book => 
            book.category.toLowerCase().includes(normalizedQuery)
        );
    }

    getDescription(): string {
        return "Búsqueda por categoría del libro";
    }
}

export class PopularitySearchStrategy implements BookSearchStrategy {
    private readonly defaultLimit = 10;

    search(books: Book[], limit?: string): Book[] {
        const numLimit = limit ? parseInt(limit) : this.defaultLimit;
        return [...books]
            .sort((a, b) => (b.timesLoaned || 0) - (a.timesLoaned || 0))
            .slice(0, numLimit);
    }

    getDescription(): string {
        return "Búsqueda por popularidad (más prestados primero)";
    }
}

// Composite Strategy para búsqueda combinada
export class CompositeSearchStrategy implements BookSearchStrategy {
    constructor(private strategies: BookSearchStrategy[]) {}

    search(books: Book[], query: string): Book[] {
        const results = new Set<Book>();
        
        this.strategies.forEach(strategy => {
            strategy.search(books, query).forEach(book => results.add(book));
        });

        return Array.from(results);
    }

    getDescription(): string {
        return "Búsqueda combinada usando múltiples criterios";
    }
}

// Context
export class BookSearchContext {
    constructor(private strategy: BookSearchStrategy) {}

    setStrategy(strategy: BookSearchStrategy): void {
        this.strategy = strategy;
    }

    executeSearch(books: Book[], query: string): Book[] {
        return this.strategy.search(books, query);
    }

    getStrategyDescription(): string {
        return this.strategy.getDescription();
    }
}

// Factory for creating strategies
export class SearchStrategyFactory {
    static createStrategy(type: 'title' | 'author' | 'category' | 'popularity' | 'combined'): BookSearchStrategy {
        switch (type) {
            case 'title':
                return new TitleSearchStrategy();
            case 'author':
                return new AuthorSearchStrategy();
            case 'category':
                return new CategorySearchStrategy();
            case 'popularity':
                return new PopularitySearchStrategy();
            case 'combined':
                return new CompositeSearchStrategy([
                    new TitleSearchStrategy(),
                    new AuthorSearchStrategy(),
                    new CategorySearchStrategy()
                ]);
            default:
                throw new Error('Tipo de estrategia de búsqueda inválido');
        }
    }
}