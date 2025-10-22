import { User } from '../models/User';

export class UserService {
    private users: User[] = [];

    async getAll(): Promise<User[]> {
        return this.users;
    }

    async getById(id: string): Promise<User | null> {
        return this.users.find(user => user.id === id) || null;
    }

    async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
        const user = new User(
            Date.now().toString(),
            userData.name,
            userData.email,
            userData.role
        );
        this.users.push(user);
        return user;
    }

    async update(id: string, userData: Partial<User>): Promise<User | null> {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return null;
        
        this.users[index] = { ...this.users[index], ...userData };
        return this.users[index];
    }

    async delete(id: string): Promise<boolean> {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return false;
        
        this.users.splice(index, 1);
        return true;
    }
}