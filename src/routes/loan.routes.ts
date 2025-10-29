import { Router } from 'express';
import { LoanController } from '../controllers/loan.controllers';
import { LoanService } from '../services/loan.services';
import { NotificationSystem } from '../patterns/observer/notificationSystem';
import { BookService } from '../services/book.services';
import { UserService } from '../services/user.services';

// Create instances
const notificationSystem = new NotificationSystem();
const bookService = new BookService();
const userService = new UserService();
const loanService = new LoanService(notificationSystem, bookService, userService);
const loanController = new LoanController(loanService);

export const loanRoutes = Router();

// Get all loans
loanRoutes.get('/', loanController.getAll);

// Get loan by id
loanRoutes.get('/:id', loanController.getById);

// Get user's active loans
loanRoutes.get('/user/:userId', loanController.getUserLoans);

// Create new loan
loanRoutes.post('/', loanController.create);

// Return a loan
loanRoutes.post('/:id/return', loanController.returnLoan);

// Renew a loan
loanRoutes.post('/:id/renew', loanController.renewLoan);