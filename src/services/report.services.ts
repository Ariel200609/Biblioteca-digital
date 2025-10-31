import { LoanService } from './loan.services';
import { UserService } from './user.services';
import { BookService } from './book.services';
import { LoanStatus } from '../models/loan.models';
import { ActiveLoansReport as ActiveLoansReportTemplate, 
         ActiveUsersReport as ActiveUsersReportTemplate, 
         BookStatisticsReport as BookStatisticsReportTemplate } from '../patterns/template/reportTemplate';

export class ReportService {
    constructor(
        private loanService: LoanService,
        private userService: UserService,
        private bookService: BookService
    ) {}

    async getActiveLoansReport(): Promise<any> {
        const report = new ActiveLoansReportTemplate(this.loanService, this.userService, this.bookService);
        return report.generateReport();
    }

    async getActiveUsersReport(): Promise<any> {
        const report = new ActiveUsersReportTemplate(this.loanService, this.userService, this.bookService);
        return report.generateReport();
    }

    async getBookStatisticsReport(): Promise<any> {
        const report = new BookStatisticsReportTemplate(this.loanService, this.userService, this.bookService);
        return report.generateReport();

        // Get most borrowed books (top 5)
}
    }
}