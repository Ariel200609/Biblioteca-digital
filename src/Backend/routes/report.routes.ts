import { Router } from 'express';
import { ReportController } from '../controllers/report.controllers';
import { ReportService } from '../services/report.services';
import { LoanService } from '../services/loan.services';
import { UserService } from '../services/user.services';
import { BookService } from '../services/book.services';
import { NotificationSystem } from '../patterns/observer/notificationSystem';

const router = Router();

// 1. Instanciar dependencias reales (No usar null)
const notificationSystem = new NotificationSystem();
const bookService = new BookService();
const userService = new UserService();

// 2. Crear LoanService inyectando las dependencias
const loanService = new LoanService(notificationSystem, bookService, userService);

// 3. Crear ReportService con todo conectado
const reportService = new ReportService(loanService, userService, bookService);

// 4. Controlador
const reportController = new ReportController(reportService);

// Rutas
router.get('/loans/active', (req, res) => reportController.getActiveLoansReport(req, res));
router.get('/users/active', (req, res) => reportController.getActiveUsersReport(req, res));
router.get('/books/statistics', (req, res) => reportController.getBookStatisticsReport(req, res));

export default router;