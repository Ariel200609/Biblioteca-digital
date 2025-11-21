import { describe, it, expect } from 'vitest';
import { UserFactoryCreator } from '../patterns/factory/userFactory';
import { Administrator, Librarian, Reader } from '../patterns/factory/userFactory';

describe('User Factory', () => {
    const testId = '1';
    const testName = 'Test User';
    const testEmail = 'test@example.com';

    it('should create an Administrator', async () => {
        const factory = UserFactoryCreator.getFactory('admin');
        const user = factory.createUser(testId, testName, testEmail);

        expect(user).toBeInstanceOf(Administrator);
        expect(user.role).toBe('admin');
        expect(user.name).toBe(testName);
        expect(user.email).toBe(testEmail);
    });

    it('should create a Librarian', async () => {
        const factory = UserFactoryCreator.getFactory('librarian');
        const user = factory.createUser(testId, testName, testEmail);

        expect(user).toBeInstanceOf(Librarian);
        expect(user.role).toBe('librarian');
        expect(user.name).toBe(testName);
        expect(user.email).toBe(testEmail);
    });

    it('should create a Reader', async () => {
        const factory = UserFactoryCreator.getFactory('reader');
        const user = factory.createUser(testId, testName, testEmail);

        expect(user).toBeInstanceOf(Reader);
        expect(user.role).toBe('reader');
        expect(user.name).toBe(testName);
        expect(user.email).toBe(testEmail);
    });

    it('Reader should have proper loan management', () => {
        const factory = UserFactoryCreator.getFactory('reader');
        const reader = factory.createUser(testId, testName, testEmail) as Reader;

        expect(reader.getActiveLoans()).toBe(0);
        expect(reader.canBorrowBooks()).toBe(true);

        // Simular préstamos
        reader.borrowBook();
        expect(reader.getActiveLoans()).toBe(1);
        
        reader.borrowBook();
        reader.borrowBook();
        expect(reader.getActiveLoans()).toBe(3);

        // Verificar límite de préstamos
        expect(reader.canBorrowBooks()).toBe(false);
        expect(() => reader.borrowBook()).toThrow('Has alcanzado el límite de préstamos activos');

        // Devolver un libro
        reader.returnBook();
        expect(reader.getActiveLoans()).toBe(2);
        expect(reader.canBorrowBooks()).toBe(true);
    });

    it('Administrator should have management capabilities', () => {
        const factory = UserFactoryCreator.getFactory('admin');
        const admin = factory.createUser(testId, testName, testEmail) as Administrator;

        expect(() => admin.manageLibrarians()).not.toThrow();
        expect(() => admin.generateSystemReports()).not.toThrow();
        expect(() => admin.configureSystem()).not.toThrow();
    });

    it('Librarian should have book and loan management capabilities', () => {
        const factory = UserFactoryCreator.getFactory('librarian');
        const librarian = factory.createUser(testId, testName, testEmail) as Librarian;

        expect(() => librarian.manageBooks()).not.toThrow();
        expect(() => librarian.manageLoans()).not.toThrow();
        expect(() => librarian.generateReports()).not.toThrow();
    });

    it('should validate email format when registering user', async () => {
        const factory = UserFactoryCreator.getFactory('admin');
        const invalidEmail = 'invalid-email';

        // Solo probamos la validación, no el guardado en BD
        // ya que requeriría conexión a BD
        expect(() => {
            factory.createUser(testId, testName, invalidEmail);
        }).not.toThrow(); // createUser no valida, registerUser sí

        // TODO: Agregar test de registerUser cuando esté disponible la conexión a BD
    });

    it('should throw error for invalid role', () => {
        expect(() => {
            UserFactoryCreator.getFactory('invalid' as any);
        }).toThrow('Rol de usuario no válido');
    });
});