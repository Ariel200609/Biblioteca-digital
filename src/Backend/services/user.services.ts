import { User } from '../models/user.models';
import { UserFactoryCreator } from '../patterns/factory/userFactory';

interface UserEntity {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'librarian' | 'reader';
    isActive: boolean;
    activeLoans: string[];
    createdAt: Date;
    updatedAt: Date;
}

export class UserService {
    private users: UserEntity[] = [];

    async getAll(): Promise<UserEntity[]> {
        return this.users;
    }

    async getById(id: string): Promise<UserEntity | null> {
        return this.users.find(u => u.id === id) || null;
    }

    async create(userData: {
        name: string;
        email: string;
        role: 'admin' | 'librarian' | 'reader';
    }): Promise<UserEntity> {
        // Validar que el email sea único
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const user: UserEntity = {
            id: Math.random().toString(36).substring(7),
            name: userData.name,
            email: userData.email,
            role: userData.role,
            isActive: true,
            activeLoans: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.users.push(user);
        return user;
    }

    async update(id: string, userData: Partial<UserEntity>): Promise<UserEntity | null> {
        const currentUser = this.users.find(u => u.id === id);
        if (!currentUser) return null;

        // Actualizar los campos permitidos
        if (userData.name) currentUser.name = userData.name;
        if (userData.email) currentUser.email = userData.email;
        if (userData.role) currentUser.role = userData.role;
        if (userData.isActive !== undefined) currentUser.isActive = userData.isActive;
        if (userData.activeLoans !== undefined) currentUser.activeLoans = userData.activeLoans;
        currentUser.updatedAt = new Date();

        return currentUser;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) return false;
        this.users.splice(index, 1);
        return true;
    }
}