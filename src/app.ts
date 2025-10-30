import express from 'express';
import { userRoutes } from './routes/user.routes';
import { bookRoutes } from './routes/book.routes';
import { loanRoutes } from './routes/loan.routes';
import reportRoutes from './routes/report.routes';
import notificationRoutes from './routes/notification.routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

export default app;