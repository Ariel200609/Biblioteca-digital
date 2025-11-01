import { AppDataSource } from './config/database.config';

const showTables = async () => {
    try {
        // Inicializar la conexión
        await AppDataSource.initialize();
        
        // Obtener todas las tablas
        const tables = await AppDataSource.query(`
            SELECT name FROM sqlite_master 
            WHERE type='table' 
            AND name NOT LIKE 'sqlite_%'
        `);

        console.log('\n📋 Tablas en la base de datos:');
        console.log('------------------------');
        
        // Para cada tabla, mostrar su estructura y contenido
        for (const table of tables) {
            const tableName = table.name;
            console.log(`\n📑 Tabla: ${tableName}`);
            
            // Mostrar estructura
            const structure = await AppDataSource.query(`PRAGMA table_info(${tableName})`);
            console.log('\nEstructura:');
            console.table(structure.map((col: any) => ({
                name: col.name,
                type: col.type,
                nullable: col.notnull ? 'No' : 'Yes',
                default: col.dflt_value
            })));

            // Mostrar contenido
            const content = await AppDataSource.query(`SELECT * FROM ${tableName}`);
            console.log('\nContenido:');
            console.table(content);
        }

        await AppDataSource.destroy();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

showTables();