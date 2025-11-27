import fs from 'fs/promises';
import path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

export class JsonDb<T extends { id: string }> {
    private filePath: string;

    constructor(filename: string) {
        const dataDir = path.join(__dirname, 'storage');
        
        // Asegurar que el directorio existe
        if (!existsSync(dataDir)) {
            mkdirSync(dataDir, { recursive: true });
        }

        this.filePath = path.join(dataDir, filename);

        // Asegurar que el archivo existe (si no, crear array vacío)
        if (!existsSync(this.filePath)) {
            writeFileSync(this.filePath, '[]', 'utf-8');
        }
    }

    async read(): Promise<T[]> {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data, (key, value) => {
                // Convertir strings de fecha a objetos Date automáticamente
                if (key.endsWith('At') || key === 'dueDate' || key === 'loanDate' || key === 'returnDate') {
                    return value ? new Date(value) : null;
                }
                return value;
            });
        } catch (error) {
            return [];
        }
    }

    async write(data: T[]): Promise<void> {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    async getAll(): Promise<T[]> {
        return await this.read();
    }

    async getById(id: string): Promise<T | undefined> {
        const items = await this.read();
        return items.find(item => item.id === id);
    }

    async add(item: T): Promise<T> {
        const items = await this.read();
        items.push(item);
        await this.write(items);
        return item;
    }

    async update(id: string, updates: Partial<T>): Promise<T | null> {
        const items = await this.read();
        const index = items.findIndex(item => item.id === id);
        
        if (index === -1) return null;

        const updatedItem = { ...items[index], ...updates };
        items[index] = updatedItem;
        
        await this.write(items);
        return updatedItem;
    }

    async delete(id: string): Promise<boolean> {
        const items = await this.read();
        const filtered = items.filter(item => item.id !== id);
        
        if (filtered.length === items.length) return false;
        
        await this.write(filtered);
        return true;
    }
}