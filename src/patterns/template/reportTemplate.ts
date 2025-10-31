import { LoanService } from '../../services/loan.services';
import { UserService } from '../../services/user.services';
import { BookService } from '../../services/book.services';
import { LoanStatus } from '../../models/loan.models';

// Clase base abstracta para los reportes
export abstract class ReportTemplate<T> {
    protected constructor(
        protected loanService: LoanService,
        protected userService: UserService,
        protected bookService: BookService
    ) {}

    // Metodo template que define la estructura del algoritmo
    async generateReport(): Promise<T> {
        await this.prepareData();
        const report = await this.createReport();
        await this.formatReport();
        return report;
    }

    // Metodos abstractos que las clases hijas deben implementar
    protected abstract prepareData(): Promise<void>;
    protected abstract createReport(): Promise<T>;
    protected abstract formatReport(): Promise<void>;

    // Metodos de utilidad compartidos por todos los reportes
    protected async getActiveLoans() {
        const loans = await this.loanService.getAllLoans();
        return loans.filter(loan => loan.status === LoanStatus.ACTIVE);
    }

    protected async getOverdueLoans() {
        const activeLoans = await this.getActiveLoans();
        const now = new Date();
        return activeLoans.filter(loan => loan.dueDate < now);
    }

    protected getUniqueUserIds(loans: any[]): Set<string> {
        return new Set(loans.map(loan => loan.userId));
    }
}

// Implementacion para el reporte de prestamos activos
export class ActiveLoansReport extends ReportTemplate<any> {
    private loans: any[] = [];
    private activeLoans: any[] = [];

    constructor(loanService: LoanService, userService: UserService, bookService: BookService) {
        super(loanService, userService, bookService);
    }

    protected async prepareData(): Promise<void> {
        this.loans = await this.loanService.getAllLoans();
        this.activeLoans = await this.getActiveLoans();
    }

    protected async createReport(): Promise<any> {
        const now = new Date();
        return {
            totalActiveLoans: this.activeLoans.length,
            loans: this.activeLoans.map(loan => ({
                loanId: loan.id,
                bookId: loan.bookId,
                userId: loan.userId,
                dueDate: loan.dueDate,
                isOverdue: loan.dueDate < now
            }))
        };
    }

    protected async formatReport(): Promise<void> {
        // Aquí se podría implementar formato específico si es necesario
    }
}

// Implementación específica para reporte de usuarios activos
export class ActiveUsersReport extends ReportTemplate<any> {
    private users: any[] = [];
    private activeLoans: any[] = [];
    private overdueLoans: any[] = [];

    constructor(loanService: LoanService, userService: UserService, bookService: BookService) {
        super(loanService, userService, bookService);
    }

    protected async prepareData(): Promise<void> {
        [this.users, this.activeLoans] = await Promise.all([
            this.userService.getAll(),
            this.getActiveLoans()
        ]);
        this.overdueLoans = await this.getOverdueLoans();
    }

    protected async createReport(): Promise<any> {
        const usersWithLoans = this.getUniqueUserIds(this.activeLoans);
        const usersWithOverdueLoans = this.getUniqueUserIds(this.overdueLoans);

        return {
            totalUsers: this.users.length,
            activeUsers: this.users.filter(user => user.isActive).length,
            usersWithLoans: usersWithLoans.size,
            usersWithOverdueLoans: usersWithOverdueLoans.size
        };
    }

    protected async formatReport(): Promise<void> {
        // Aquí se podría implementar formato específico si es necesario
    }
}

// Implementación específica para reporte de estadísticas de libros
export class BookStatisticsReport extends ReportTemplate<any> {
    private books: any[] = [];
    private loans: any[] = [];
    private activeLoans: any[] = [];

    constructor(loanService: LoanService, userService: UserService, bookService: BookService) {
        super(loanService, userService, bookService);
    }

    protected async prepareData(): Promise<void> {
        [this.books, this.loans] = await Promise.all([
            this.bookService.getAll(),
            this.loanService.getAllLoans()
        ]);
        this.activeLoans = await this.getActiveLoans();
    }

    protected async createReport(): Promise<any> {
        const bookLoanCount = new Map<string, number>();
        this.loans.forEach(loan => {
            const count = bookLoanCount.get(loan.bookId) || 0;
            bookLoanCount.set(loan.bookId, count + 1);
        });

        const mostBorrowedBooks = Array.from(bookLoanCount.entries())
            .map(([bookId, count]) => ({ bookId, timesLoaned: count }))
            .sort((a, b) => b.timesLoaned - a.timesLoaned)
            .slice(0, 5);

        const booksWithActiveLoans = new Set(this.activeLoans.map(loan => loan.bookId));
        const availableBooks = this.books.filter(book => !booksWithActiveLoans.has(book.id)).length;

        return {
            totalBooks: this.books.length,
            availableBooks: availableBooks,
            loanedBooks: this.activeLoans.length,
            mostBorrowedBooks,
            overdueBooks: (await this.getOverdueLoans()).length
        };
    }

    protected async formatReport(): Promise<void> {
        // Aquí se podría implementar formato específico si es necesario
    }
}