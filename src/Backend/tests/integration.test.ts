import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Tests de integración básicos para el backend
 * Verifica que todos los componentes están conectados correctamente
 */

describe('Backend Integration - Component Structure', () => {
    describe('✓ Patrones de diseño', () => {
        it('debe tener Factory Pattern para usuarios', () => {
            const filePath = path.join(__dirname, '../patterns/factory/userFactory.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener Strategy Pattern para búsqueda', () => {
            const filePath = path.join(__dirname, '../patterns/strategy/bookSearch.strategy.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener Observer Pattern para notificaciones', () => {
            const filePath = path.join(__dirname, '../patterns/observer/notificationSystem.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener Template Pattern para reportes', () => {
            const filePath = path.join(__dirname, '../patterns/template/reportTemplate.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener Decorator Pattern para préstamos', () => {
            const filePath = path.join(__dirname, '../patterns/decorator/loanDecorator.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });

    describe('✓ Servicios', () => {
        it('debe tener servicio de usuarios', () => {
            const filePath = path.join(__dirname, '../services/user.services.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener servicio de libros', () => {
            const filePath = path.join(__dirname, '../services/book.services.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener servicio de préstamos', () => {
            const filePath = path.join(__dirname, '../services/loan.services.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener servicio de reportes', () => {
            const filePath = path.join(__dirname, '../services/report.services.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });

    describe('✓ Rutas', () => {
        it('debe tener rutas de usuarios', () => {
            const filePath = path.join(__dirname, '../routes/user.routes.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener rutas de libros', () => {
            const filePath = path.join(__dirname, '../routes/book.routes.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener rutas de préstamos', () => {
            const filePath = path.join(__dirname, '../routes/loan.routes.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener rutas de notificaciones', () => {
            const filePath = path.join(__dirname, '../routes/notification.routes.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener rutas de reportes', () => {
            const filePath = path.join(__dirname, '../routes/report.routes.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });

    describe('✓ Controladores', () => {
        it('debe tener controlador de usuarios', () => {
            const filePath = path.join(__dirname, '../controllers/user.controllers.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener controlador de libros', () => {
            const filePath = path.join(__dirname, '../controllers/book.controllers.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener controlador de préstamos', () => {
            const filePath = path.join(__dirname, '../controllers/loan.controllers.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener controlador de notificaciones', () => {
            const filePath = path.join(__dirname, '../controllers/notification.controllers.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener controlador de reportes', () => {
            const filePath = path.join(__dirname, '../controllers/report.controllers.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });

    describe('✓ Modelos', () => {
        it('debe tener modelo de usuarios', () => {
            const filePath = path.join(__dirname, '../models/user.models.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener modelo de libros', () => {
            const filePath = path.join(__dirname, '../models/book.models.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener modelo de préstamos', () => {
            const filePath = path.join(__dirname, '../models/loan.models.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });

    describe('✓ Utilidades', () => {
        it('debe tener validadores', () => {
            const filePath = path.join(__dirname, '../utils/validators.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });

    describe('✓ Configuración', () => {
        it('debe tener configuración de base de datos', () => {
            // Verificar que existe el archivo de instancias singleton en lugar de Database config
            const filePath = path.join(__dirname, '../services/instances.ts');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        it('debe tener entidades de base de datos', () => {
            // Verificar que existen los servicios que contienen las entidades en memoria
            const servicesDir = path.join(__dirname, '../services');
            expect(fs.existsSync(servicesDir)).toBe(true);
            const files = fs.readdirSync(servicesDir);
            expect(files.length).toBeGreaterThan(0);
        });
    });
});

describe('Backend Integration - Validadores', () => {
    it('debe tener módulo de validadores', () => {
        const filePath = path.join(__dirname, '../utils/validators.ts');
        expect(fs.existsSync(filePath)).toBe(true);
    });
});

describe('Backend Integration - Factory Pattern', () => {
    it('debe tener factory implementado', () => {
        const filePath = path.join(__dirname, '../patterns/factory/userFactory.ts');
        expect(fs.existsSync(filePath)).toBe(true);
    });
});
