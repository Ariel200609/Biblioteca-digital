import { DataSource } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';
import { Book } from '../entities/Book.entity';
import { User } from '../entities/User.entity';
import { Loan } from '../entities/Loan.entity';
import { Notification } from '../entities/Notification.entity';

// Cargar variables de entorno
dotenv.config();

// Configuración de la base de datos MySQL
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "biblioteca_digital",
    synchronize: true,
    logging: true,
    entities: [Book, User, Loan, Notification],
    migrations: [path.join(__dirname, '../migrations/*.ts')],
    charset: 'utf8mb4',
    extra: {
        connectionLimit: 10
    }
});

// Inicialización de la base de datos
export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("✅ Base de datos MySQL inicializada correctamente");
    } catch (error) {
        console.error("❌ Error al inicializar la base de datos:", error);
        throw error;
    }
};