export interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    description: string;
    available: boolean;
    timesLoaned: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBookDTO {
    title: string;
    author: string;
    isbn: string;
    category: string;
    description?: string;
}

export interface UpdateBookDTO {
    title?: string;
    author?: string;
    isbn?: string;
    category?: string;
    description?: string;
    available?: boolean;
}
