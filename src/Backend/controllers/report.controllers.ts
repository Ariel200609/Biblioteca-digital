import { Request, Response } from 'express';
import { ReportService } from '../services/report.services';

export class ReportController {
    constructor(private reportService: ReportService) {}

    // Obtener reporte de préstamos activos
    async getActiveLoansReport(req: Request, res: Response) {
        try {
            const report = await this.reportService.getActiveLoansReport();
            res.json(report);
        } catch (error) {
            res.status(500).json({
                message: 'Error al generar el reporte de préstamos activos',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    // Obtener reporte de usuarios activos
    async getActiveUsersReport(req: Request, res: Response) {
        try {
            const report = await this.reportService.getActiveUsersReport();
            res.json(report);
        } catch (error) {
            res.status(500).json({
                message: 'Error al generar el reporte de usuarios activos',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    // Obtener estadísticas de libros
    async getBookStatisticsReport(req: Request, res: Response) {
        try {
            const report = await this.reportService.getBookStatisticsReport();
            res.json(report);
        } catch (error) {
            res.status(500).json({
                message: 'Error al generar las estadísticas de libros',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}