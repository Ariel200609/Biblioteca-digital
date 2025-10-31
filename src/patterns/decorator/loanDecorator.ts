import { Loan, LoanStatus } from '../../models/loan.models';

// Interfaz componente base
export interface ILoan {
    getId(): string;
    getDueDate(): Date;
    getUserId(): string;
    getBookId(): string;
    getStatus(): LoanStatus;
    getRenewalCount(): number;
    canBeRenewed(): boolean;
    isOverdue(): boolean;
}

// Componente concreto - Préstamo base
export class BasicLoan implements ILoan {
    constructor(private loan: Loan) {}

    getId(): string {
        return this.loan.id;
    }

    getDueDate(): Date {
        return this.loan.dueDate;
    }

    getUserId(): string {
        return this.loan.userId;
    }

    getBookId(): string {
        return this.loan.bookId;
    }

    getStatus(): LoanStatus {
        return this.loan.status;
    }

    getRenewalCount(): number {
        return this.loan.renewalCount;
    }

    canBeRenewed(): boolean {
        return this.loan.status === LoanStatus.ACTIVE && 
               this.loan.renewalCount < 2 &&
               !this.isOverdue();
    }

    isOverdue(): boolean {
        return this.loan.dueDate < new Date();
    }
}

// Decorator base abstracto
export abstract class LoanDecorator implements ILoan {
    constructor(protected loan: ILoan) {}

    getId(): string {
        return this.loan.getId();
    }

    getDueDate(): Date {
        return this.loan.getDueDate();
    }

    getUserId(): string {
        return this.loan.getUserId();
    }

    getBookId(): string {
        return this.loan.getBookId();
    }

    getStatus(): LoanStatus {
        return this.loan.getStatus();
    }

    getRenewalCount(): number {
        return this.loan.getRenewalCount();
    }

    canBeRenewed(): boolean {
        return this.loan.canBeRenewed();
    }

    isOverdue(): boolean {
        return this.loan.isOverdue();
    }
}

// Decorator para préstamos prioritarios (más tiempo de préstamo)
export class PriorityLoanDecorator extends LoanDecorator {
    private readonly EXTRA_DAYS = 7;

    getDueDate(): Date {
        const originalDueDate = super.getDueDate();
        const extendedDueDate = new Date(originalDueDate);
        extendedDueDate.setDate(extendedDueDate.getDate() + this.EXTRA_DAYS);
        return extendedDueDate;
    }

    canBeRenewed(): boolean {
        return super.canBeRenewed() && this.getRenewalCount() < 3;
    }
}

// Decorator para préstamos académicos (más renovaciones permitidas)
export class AcademicLoanDecorator extends LoanDecorator {
    private readonly MAX_RENEWALS = 5;

    canBeRenewed(): boolean {
        return this.getStatus() === LoanStatus.ACTIVE && 
               this.getRenewalCount() < this.MAX_RENEWALS &&
               !this.isOverdue();
    }
}

// Decorator para préstamos restringidos (sin renovaciones)
export class RestrictedLoanDecorator extends LoanDecorator {
    canBeRenewed(): boolean {
        return false;
    }

    isOverdue(): boolean {
        // Los préstamos restringidos se consideran vencidos un día antes
        const dueDate = new Date(this.getDueDate());
        dueDate.setDate(dueDate.getDate() - 1);
        return dueDate < new Date();
    }
}