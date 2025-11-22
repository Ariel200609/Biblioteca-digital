export enum LoanStatus {
    ACTIVE = 'active',
    OVERDUE = 'overdue',
    RETURNED = 'returned',
    CANCELLED = 'cancelled'
}

// DTO para crear un préstamo
export interface CreateLoanDTO {
    userId: string;
    bookId: string;
    loanDate?: Date | string; // Fecha cuando se realizó el préstamo
    dueDate?: Date | string; // Puede ser Date o string ISO
}

// Modelo principal de préstamo
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

// DTO con detalles extendidos del préstamo
export interface LoanWithDetails extends Loan {
    book?: {
        title: string;
        author: string;
    };
    user?: {
        name: string;
        email: string;
    };
    returned: boolean;
    createdAt: Date;
}