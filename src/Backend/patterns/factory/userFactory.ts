import { User } from '../../models/user.models';
import { validateEmail } from '../../utils/validators';

// Clases especificas para cada tipo de usuario
export class Administrator extends User {
    constructor(id: string, name: string, email: string) {
        super(id, name, email, 'admin');
    }

    // Metodos especificos de administrador
    manageLibrarians(): void {
        console.log('Administrador puede gestionar bibliotecarios');
    }

    generateSystemReports(): void {
        console.log('Administrador puede generar reportes del sistema');
    }

    configureSystem(): void {
        console.log('Administrador puede configurar el sistema');
    }
}

export class Librarian extends User {
    constructor(id: string, name: string, email: string) {
        super(id, name, email, 'librarian');
    }

    // Metodos especificos de bibliotecario
    manageBooks(): void {
        console.log('Bibliotecario puede gestionar libros');
    }

    manageLoans(): void {
        console.log('Bibliotecario puede gestionar prestamos');
    }

    generateReports(): void {
        console.log('Bibliotecario puede generar reportes básicos');
    }
}

export class Reader extends User {
    private readonly MAX_LOANS: number = 3;

    constructor(id: string, name: string, email: string) {
        super(id, name, email, 'reader');
    }

    // Metodos especificos de lector
    canBorrowBooks(): boolean {
        return this.activeLoans < this.MAX_LOANS;
    }

    borrowBook(): void {
        if (this.canBorrowBooks()) {
            this.activeLoans++;
        } else {
            throw new Error('Has alcanzado el límite de préstamos activos');
        }
    }

    returnBook(): void {
        if (this.activeLoans > 0) {
            this.activeLoans--;
        }
    }

    getActiveLoans(): number {
        return this.activeLoans;
    }
}

// Factory Method
export abstract class UserFactory {
    abstract createUser(id: string, name: string, email: string): User;

    // Metodo template para registro de usuario
    async registerUser(id: string, name: string, email: string): Promise<User> {
        this.validateUserData(id, name, email);
        const user = this.createUser(id, name, email);
        await this.notifyUserCreation(user);
        return user;
    }

    private validateUserData(id: string, name: string, email: string): void {
        if (!id || !name || !email) {
            throw new Error('ID, nombre y email son requeridos');
        }
        if (!validateEmail(email)) {
            throw new Error('Email no válido');
        }
    }

    protected async notifyUserCreation(user: User): Promise<void> {
        console.log(`Nuevo usuario ${user.role} creado: ${user.name} (${user.email})`);
        // Aqui iria la lógica de notificación (envío de emails, etc.)
    }
}

// Concrete Factories
export class AdministratorFactory extends UserFactory {
    createUser(id: string, name: string, email: string): User {
        return new Administrator(id, name, email);
    }
}

export class LibrarianFactory extends UserFactory {
    createUser(id: string, name: string, email: string): User {
        return new Librarian(id, name, email);
    }
}

export class ReaderFactory extends UserFactory {
    createUser(id: string, name: string, email: string): User {
        return new Reader(id, name, email);
    }
}

// Creator of factories
export class UserFactoryCreator {
    static getFactory(role: 'admin' | 'librarian' | 'reader'): UserFactory {
        switch (role) {
            case 'admin':
                return new AdministratorFactory();
            case 'librarian':
                return new LibrarianFactory();
            case 'reader':
                return new ReaderFactory();
            default:
                throw new Error('Rol de usuario no válido');
        }
    }
}