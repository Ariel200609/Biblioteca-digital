import { Router } from 'express';
import { LoanController } from '../controllers/loan.controllers';
import { LoanService } from '../services/loan.services';
import { NotificationSystem } from '../patterns/observer/notificationSystem';
import { BookService } from '../services/book.services';
import { UserService } from '../services/user.services';

// Crear instancias necesarias
const notificationSystem = new NotificationSystem();
const bookService = new BookService();
const userService = new UserService();
const loanService = new LoanService(notificationSystem, bookService, userService);
const loanController = new LoanController(loanService);

export const loanRoutes = Router();

// Obtener todos los prestamos
loanRoutes.get('/', loanController.getAll);

// Obtener prestamo por id
loanRoutes.get('/:id', loanController.getById);

// Obtener prestamos activos de un usuario
loanRoutes.get('/user/:userId', loanController.getUserLoans);

// Crear nuevo prestamo
loanRoutes.post('/', loanController.create);

// Devolver un prestamo
loanRoutes.post('/:id/return', loanController.returnLoan);

// Renew a loan
loanRoutes.post('/:id/renew', loanController.renewLoan);