import { DataSource } from 'typeorm';
import path from 'path';

// Entidades
import { Book } from '../../Database/entities/Book.entity';
import { User } from '../../Database/entities/User.entity';
import { Loan } from '../../Database/entities/Loan.entity';
import { Notification } from '../../Database/entities/Notification.entity';

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: path.join(__dirname, '../../..', 'database.sqlite'),
    synchronize: process.env.NODE_ENV === 'development', // Solo en desarrollo
    logging: process.env.NODE_ENV === 'development',
    entities: [Book, User, Loan, Notification],
    migrations: [path.join(__dirname, '../migrations/*.ts')],
});

// Función de inicialización
export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
        throw error;
    }
};