import express from 'express';
import cors from 'cors';
import { userRoutes } from './Backend/routes/user.routes';
import { bookRoutes } from './Backend/routes/book.routes';
import { loanRoutes } from './Backend/routes/loan.routes';
import reportRoutes from './Backend/routes/report.routes';
import notificationRoutes from './Backend/routes/notification.routes';
import { Seeder } from './Backend/seeders/seed';

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

// Ejecutar seeder al iniciar
const seeder = new Seeder();
seeder.seed();
    
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'API funcionando correctamente' });
})
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

export default app;