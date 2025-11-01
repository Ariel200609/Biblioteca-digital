import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function setupDatabase() {
    try {
        // Crear conexión inicial (sin seleccionar una base de datos)
        const connection = await createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });

        // Crear la base de datos si no existe
        await connection.query(`
            CREATE DATABASE IF NOT EXISTS biblioteca_digital
            CHARACTER SET utf8mb4 
            COLLATE utf8mb4_unicode_ci
        `);

        console.log('✅ Base de datos creada o verificada correctamente');

        // Cerrar la conexión
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al configurar la base de datos:', error);
        process.exit(1);
    }
}

setupDatabase();