import express from 'express';
import "reflect-metadata";
import { userRoutes } from './Backend/routes/user.routes';
import { bookRoutes } from './Backend/routes/book.routes';
import { loanRoutes } from './Backend/routes/loan.routes';
import reportRoutes from './Backend/routes/report.routes';
import notificationRoutes from './Backend/routes/notification.routes';
import { initializeDatabase } from './Database/config/database.config';

const app = express();

// Initialize database
initializeDatabase()
    .then(() => console.log('✅ Base de datos conectada'))
    .catch(error => {
        console.error('❌ Error al conectar la base de datos:', error);
        process.exit(1);
    });
    
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