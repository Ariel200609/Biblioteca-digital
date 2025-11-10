import { Router } from 'express';
import { ReportController } from '../controllers/report.controllers';
import { ReportService } from '../services/report.services';
import { LoanService } from '../services/loan.services';
import { UserService } from '../services/user.services';
import { BookService } from '../services/book.services';

const router = Router();

// Crear instancias de los servicios necesarios
const loanService = new LoanService(null as any, null as any, null as any); // Ajusta los parámetros según tu implementación
const userService = new UserService();
const bookService = new BookService();

// Crear instancia del servicio de reportes
const reportService = new ReportService(loanService, userService, bookService);

// Crear instancia del controlador
const reportController = new ReportController(reportService);

// Definir rutas
router.get('/loans/active', (req, res) => reportController.getActiveLoansReport(req, res));
router.get('/users/active', (req, res) => reportController.getActiveUsersReport(req, res));
router.get('/books/statistics', (req, res) => reportController.getBookStatisticsReport(req, res));

export default router;