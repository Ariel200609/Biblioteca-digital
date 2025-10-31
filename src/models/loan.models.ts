export enum LoanStatus {
    ACTIVE = 'active',
    OVERDUE = 'overdue',
    RETURNED = 'returned',
    CANCELLED = 'cancelled'
}

export interface CreateLoanDTO {
    userId: string;
    bookId: string;
    dueDate: Date;
}

export interface Loan {
    id: string;
    userId: string;
    bookId: string;
    loanDate: Date;
    dueDate: Date;
    returnDate?: Date;
    status: LoanStatus;
    renewalCount: number;
    notes?: string;
}

export interface LoanWithDetails extends Loan {
    book?: {
        title: string;
        author: string;
    };
    user?: {
        name: string;
        email: string;
    };
}