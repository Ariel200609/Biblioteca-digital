import { User } from '../models/user.models';
import { UserFactoryCreator } from '../patterns/factory/userFactory';

export class UserService {
    private users: User[] = [];

    async getAll(): Promise<User[]> {
        return this.users;
    }

    async getById(id: string): Promise<User | null> {
        return this.users.find(user => user.id === id) || null;
    }

    async create(userData: {
        name: string;
        email: string;
        role: 'ADMIN' | 'LIBRARIAN' | 'READER';
    }): Promise<User> {
        const factory = UserFactoryCreator.getFactory(userData.role);
        const user = factory.registerUser(
            Date.now().toString(),
            userData.name,
            userData.email
        );
        this.users.push(user);
        return user;
    }

    async update(id: string, userData: Partial<User>): Promise<User | null> {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return null;

        const currentUser = this.users[index];
        if (!currentUser) return null;

        // Si el rol cambia, creamos una nueva instancia con el factory correspondiente
        if (userData.role && userData.role !== currentUser.role) {
            const factory = UserFactoryCreator.getFactory(userData.role);
            const updatedUser = factory.createUser(
                currentUser.id,
                userData.name || currentUser.name,
                userData.email || currentUser.email
            );
            this.users[index] = updatedUser;
            return updatedUser;
        }

        // Si solo se actualizan otros campos, mantenemos la misma instancia
        Object.assign(currentUser, userData);
        return currentUser;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return false;
        
        this.users.splice(index, 1);
        return true;
    }
}