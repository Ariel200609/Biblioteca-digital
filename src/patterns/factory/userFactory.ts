import { User } from '../../models/user.models';

// Clases especificas para cada tipo de usuario
export class Administrator extends User {
    constructor(id: string, name: string, email: string) {
        super(id, name, email, 'ADMIN');
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
        super(id, name, email, 'LIBRARIAN');
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
    private activeLoans: number = 0;
    private readonly MAX_LOANS: number = 3;

    constructor(id: string, name: string, email: string) {
        super(id, name, email, 'READER');
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
    registerUser(id: string, name: string, email: string): User {
        const user = this.createUser(id, name, email);
        this.saveUser(user);
        this.notifyUserCreation(user);
        return user;
    }

    protected saveUser(user: User): void {
        console.log(`Usuario ${user.name} guardado en la base de datos`);
        // Aqui iria la lógica de persistencia
    }

    protected notifyUserCreation(user: User): void {
        console.log(`Nuevo usuario ${user.role} creado: ${user.name}`);
        // Aqui iria la lógica de notificación
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
    static getFactory(role: 'ADMIN' | 'LIBRARIAN' | 'READER'): UserFactory {
        switch (role) {
            case 'ADMIN':
                return new AdministratorFactory();
            case 'LIBRARIAN':
                return new LibrarianFactory();
            case 'READER':
                return new ReaderFactory();
            default:
                throw new Error('Rol de usuario no válido');
        }
    }
}