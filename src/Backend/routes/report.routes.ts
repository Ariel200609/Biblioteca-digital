import { Router } from 'express';
import { ReportController } from '../controllers/report.controllers';
import { reportServiceInstance } from '../services/instances';

const router = Router();

// Crear instancia del controlador usando el singleton
const reportController = new ReportController(reportServiceInstance);

// Definir rutas
router.get('/loans/active', (req, res) => reportController.getActiveLoansReport(req, res));
router.get('/users/active', (req, res) => reportController.getActiveUsersReport(req, res));
router.get('/books/statistics', (req, res) => reportController.getBookStatisticsReport(req, res));

export default router;