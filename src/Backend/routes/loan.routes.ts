import { Router } from 'express';
import { LoanController } from '../controllers/loan.controllers';

// Crear instancia del controlador
const loanController = new LoanController();

export const loanRoutes = Router();

// Rutas específicas primero (con acciones)
loanRoutes.post('/:id/return', loanController.returnLoan);
loanRoutes.post('/:id/renew', loanController.renewLoan);

// Obtener prestamos activos de un usuario
loanRoutes.get('/user/:userId', loanController.getUserLoans);

// Crear nuevo prestamo
loanRoutes.post('/', loanController.create);

// Obtener todos los prestamos
loanRoutes.get('/', loanController.getAll);

// Obtener prestamo por id (última, más genérica)
loanRoutes.get('/:id', loanController.getById);