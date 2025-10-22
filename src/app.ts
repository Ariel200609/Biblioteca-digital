import express from 'express';
import { userRoutes } from './routes/user.routes';
import { bookRoutes } from './routes/book.routes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

export default app;