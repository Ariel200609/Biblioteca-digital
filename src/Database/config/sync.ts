import "reflect-metadata";
import { AppDataSource } from './database.config';

const syncDatabase = async () => {
    try {
        console.log('Iniciando sincronización de la base de datos...');
        
        const dataSource = await AppDataSource.initialize();
        console.log('Conexión establecida...');

        // Forzar la sincronización
        await dataSource.synchronize(true);
        console.log("✅ Base de datos sincronizada correctamente!");
        
        // Cerrar la conexión después de sincronizar
        await dataSource.destroy();
        console.log('Conexión cerrada.');
        process.exit(0);
    } catch (error) {
        console.error("❌ Error al sincronizar la base de datos:", error);
        process.exit(1);
    }
};

// Ejecutar la sincronización
syncDatabase();