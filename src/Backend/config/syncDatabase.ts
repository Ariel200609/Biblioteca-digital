import "reflect-metadata";
import { AppDataSource } from './database';

const syncDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database synchronized successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error synchronizing database:", error);
        process.exit(1);
    }
};

syncDatabase();