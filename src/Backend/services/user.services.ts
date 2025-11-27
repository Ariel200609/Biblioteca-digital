import { User } from '../models/user.models'; // Importamos del modelo, NO de la entidad
import { JsonDb } from '../data/jsonDb';
import { UserFactoryCreator } from '../patterns/factory/userFactory';

export class UserService {
    private db: JsonDb<User>;

    constructor() {
        this.db = new JsonDb<User>('users.json');
        this.seedIfEmpty();
    }

    private async seedIfEmpty() {
        const users = await this.db.getAll();
        if (users.length === 0) {
            console.log('🌱 Seeding Users JSON...');
            // Usamos el Factory para crear usuarios iniciales con la estructura correcta
            const adminFactory = UserFactoryCreator.getFactory('admin');
            const readerFactory = UserFactoryCreator.getFactory('reader');
            
            const admin = adminFactory.createUser('1', 'Admin User', 'admin@test.com');
            const reader = readerFactory.createUser('2', 'Lector Test', 'reader@test.com');
            
            await this.db.add(admin);
            await this.db.add(reader);
        }
    }

    async getAll(): Promise<User[]> {
        return this.db.getAll();
    }

    async getById(id: string): Promise<User | null> {
        return (await this.db.getById(id)) || null;
    }

    async create(userData: { name: string; email: string; role: 'admin' | 'librarian' | 'reader' }): Promise<User> {
        const factory = UserFactoryCreator.getFactory(userData.role);
        
        // CORRECCIÓN: Agregamos 'await' aquí
        const user = await factory.registerUser(
            Date.now().toString(), 
            userData.name, 
            userData.email
        );
        
        // Ahora 'user' es el objeto real (User) y no una promesa (Promise<User>)
        return this.db.add(user);
    }

    async update(id: string, userData: Partial<User>): Promise<User | null> {
        return this.db.update(id, userData);
    }

    async delete(id: string): Promise<boolean> {
        return this.db.delete(id);
    }
}