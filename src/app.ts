import express from 'express';
import cors from 'cors'; 
import "reflect-metadata";
import { userRoutes } from './Backend/routes/user.routes';
import { bookRoutes } from './Backend/routes/book.routes';
import { loanRoutes } from './Backend/routes/loan.routes';
import reportRoutes from './Backend/routes/report.routes';
import notificationRoutes from './Backend/routes/notification.routes';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'API funcionando (Mock DB)' });
});

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

export default app;