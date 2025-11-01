export enum LoanStatus {
    ACTIVE = 'ACTIVE',
    OVERDUE = 'OVERDUE',
    RETURNED = 'RETURNED'
}

export interface CreateLoanDTO {
    userId: string;
    bookId: string;
    dueDate?: Date;
}

export interface LoanWithDetails {
    id: string;
    userId: string;
    bookId: string;
    dueDate: Date;
    returned: boolean;
    renewalCount: number;
    createdAt: Date;
    book?: {
        title: string;
        author: string;
    };
    user?: {
        name: string;
        email: string;
    };
}