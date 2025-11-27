import { Loan, LoanStatus, CreateLoanDTO, LoanWithDetails } from '../models/loan.models'; // Importamos interfaces
import { NotificationSystem } from '../patterns/observer/notificationSystem';
import { LoanNotification } from '../patterns/observer/notificationTypes';
import { BookService } from './book.services';
import { UserService } from './user.services';
import { JsonDb } from '../data/jsonDb';

export class LoanService {
    private db: JsonDb<Loan>;
    private readonly LOAN_DURATION_DAYS = 14;
    private readonly MAX_RENEWALS = 2;

    constructor(
        private notificationSystem: NotificationSystem,
        private bookService: BookService,
        private userService: UserService
    ) {
        this.db = new JsonDb<Loan>('loans.json');
    }

    async createLoan(data: CreateLoanDTO): Promise<Loan> {
        const book = await this.bookService.getById(data.bookId);
        if (!book || !book.available) throw new Error('Book is not available for loan');

        const userActiveLoans = await this.getActiveLoansForUser(data.userId);
        if (userActiveLoans.length >= 3) throw new Error('User has reached maximum number of active loans');

        const loan: Loan = {
            id: Date.now().toString(),
            userId: data.userId,
            bookId: data.bookId,
            loanDate: new Date(),
            dueDate: data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + this.LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000),
            status: LoanStatus.ACTIVE,
            renewalCount: 0
        };

        const savedLoan = await this.db.add(loan);
        
        // Actualizar disponibilidad del libro
        await this.bookService.update(data.bookId, { available: false });
        
        this.notifyUser(data.userId, 'LOAN_CREATED', `Book loan created.`, savedLoan);
        return savedLoan;
    }

    async getLoanById(id: string): Promise<LoanWithDetails | null> {
        const loan = await this.db.getById(id);
        if (!loan) return null;
        return this.enrichLoan(loan);
    }

    async getAllLoans(): Promise<Loan[]> {
        const loans = await this.db.getAll();
        return loans; // Devuelve los préstamos simples
    }

    async getActiveLoansForUser(userId: string): Promise<Loan[]> {
        const loans = await this.db.getAll();
        return loans.filter(l => l.userId === userId && l.status === LoanStatus.ACTIVE);
    }

    async returnLoan(id: string): Promise<Loan | null> {
        const loan = await this.db.getById(id);
        if (!loan || loan.status === LoanStatus.RETURNED) return null;

        const updatedLoan = await this.db.update(id, { 
            status: LoanStatus.RETURNED,
            returnDate: new Date()
        });

        if (updatedLoan) {
            await this.bookService.update(updatedLoan.bookId, { available: true });
            this.notifyUser(updatedLoan.userId, 'LOAN_RETURNED', 'Book returned successfully', updatedLoan);
        }
        return updatedLoan;
    }

    async renewLoan(id: string): Promise<Loan | null> {
        const loan = await this.db.getById(id);
        if (!loan || loan.status !== LoanStatus.ACTIVE) return null;
        if (loan.renewalCount >= this.MAX_RENEWALS) throw new Error('Maximum number of renewals reached');
        if (new Date() > new Date(loan.dueDate)) throw new Error('Overdue loans cannot be renewed');

        const newDueDate = new Date(new Date(loan.dueDate).getTime() + this.LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000);
        
        const updatedLoan = await this.db.update(id, {
            dueDate: newDueDate,
            renewalCount: loan.renewalCount + 1
        });
        
        if (updatedLoan) {
            this.notifyUser(updatedLoan.userId, 'LOAN_RENEWED', 'Loan renewed', updatedLoan);
        }
        return updatedLoan;
    }

    // Método auxiliar para agregar detalles (Join manual)
    private async enrichLoan(loan: Loan): Promise<LoanWithDetails> {
        const [book, user] = await Promise.all([
            this.bookService.getById(loan.bookId),
            this.userService.getById(loan.userId)
        ]);
        
        return {
            ...loan,
            book: book ? { title: book.title, author: book.author } : undefined,
            user: user ? { name: user.name, email: user.email } : undefined,
            returned: loan.status === LoanStatus.RETURNED,
            createdAt: loan.loanDate // Mapeo para compatibilidad
        };
    }

    private notifyUser(userId: string, type: any, msg: string, loan: Loan) {
        const notif = new LoanNotification(userId, type, msg, {
            loanId: loan.id, bookId: loan.bookId, dueDate: loan.dueDate, timestamp: new Date()
        });
        this.notificationSystem.notify(notif.toDetails());
    }
}