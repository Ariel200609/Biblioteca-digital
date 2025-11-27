import { userServiceInstance, bookServiceInstance, loanServiceInstance } from '../services/instances';

export class Seeder {
    async seed() {
        try {
            console.log('🌱 Iniciando seeder...');

            // Crear usuarios
            const admin = await userServiceInstance.create({
                name: 'Admin Usuario',
                email: 'admin@biblioteca.com',
                role: 'admin'
            });

            const librarian = await userServiceInstance.create({
                name: 'Juan Bibliotecario',
                email: 'juan@biblioteca.com',
                role: 'librarian'
            });

            const reader1 = await userServiceInstance.create({
                name: 'Carlos García',
                email: 'carlos@example.com',
                role: 'reader'
            });

            const reader2 = await userServiceInstance.create({
                name: 'María López',
                email: 'maria@example.com',
                role: 'reader'
            });

            console.log('✅ Usuarios creados:', 4);

            // Crear libros
            const books = [
                {
                    title: 'El Quijote',
                    author: 'Miguel de Cervantes',
                    isbn: '9788490230505',
                    category: 'Novela',
                    description: 'Las aventuras del ingeniero Don Quixote de la Mancha',
                    timesLoaned: 0
                },
                {
                    title: '1984',
                    author: 'George Orwell',
                    isbn: '9780452284234',
                    category: 'Novela',
                    description: 'Una novela distópica de control totalitario',
                    timesLoaned: 0
                },
                {
                    title: 'Cien años de soledad',
                    author: 'Gabriel García Márquez',
                    isbn: '9788432233055',
                    category: 'Novela',
                    description: 'La historia de la familia Buendía en Macondo',
                    timesLoaned: 0
                },
                {
                    title: 'El hobbit',
                    author: 'J.R.R. Tolkien',
                    isbn: '9788432207887',
                    category: 'Infantil',
                    description: 'Las aventuras de Bilbo Bolsón',
                    timesLoaned: 0
                },
                {
                    title: 'Breve historia del tiempo',
                    author: 'Stephen Hawking',
                    isbn: '9788474329266',
                    category: 'Ciencias',
                    description: 'Explicación de física y cosmología',
                    timesLoaned: 0
                },
                {
                    title: 'Sapiens',
                    author: 'Yuval Noah Harari',
                    isbn: '9788416072451',
                    category: 'Historia',
                    description: 'Historia resumida de la humanidad',
                    timesLoaned: 0
                },
                {
                    title: 'El principito',
                    author: 'Antoine de Saint-Exupéry',
                    isbn: '9788470326785',
                    category: 'Infantil',
                    description: 'Un cuento poético para niños y adultos',
                    timesLoaned: 0
                },
                {
                    title: 'La revolución francesa',
                    author: 'Simon Schama',
                    isbn: '9788430603858',
                    category: 'Historia',
                    description: 'Análisis detallado de la revolución francesa',
                    timesLoaned: 0
                }
            ];

            const createdBooks = [];
            for (const book of books) {
                const created = await bookServiceInstance.create(book);
                createdBooks.push(created);
            }

            console.log('✅ Libros creados:', books.length);

            // Crear préstamos
            // Préstamo 1: Carlos - El Quijote (hace 5 días, vence en 9 días)
            await loanServiceInstance.createLoan({
                userId: reader1.id,
                bookId: createdBooks[0].id,
                loanDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000)
            });

            // Préstamo 2: Carlos - 1984 (hace 3 días, vence en 11 días)
            await loanServiceInstance.createLoan({
                userId: reader1.id,
                bookId: createdBooks[1].id,
                loanDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                dueDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000)
            });

            // Préstamo 3: María - Cien años de soledad (hace 1 día, vence en 13 días)
            await loanServiceInstance.createLoan({
                userId: reader2.id,
                bookId: createdBooks[2].id,
                loanDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                dueDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000)
            });

            console.log('✅ Préstamos creados:', 3);

            console.log('🌱 Seeder completado exitosamente!\n');
            console.log('📊 Datos cargados:');
            console.log('   - 4 usuarios (1 admin, 1 bibliotecario, 2 lectores)');
            console.log('   - 8 libros');
            console.log('   - 3 préstamos activos');
            console.log('\n👤 Usuarios de ejemplo:');
            console.log('   Admin: admin@biblioteca.com');
            console.log('   Bibliotecario: juan@biblioteca.com');
            console.log('   Lector 1: carlos@example.com');
            console.log('   Lector 2: maria@example.com\n');
        } catch (error) {
            console.error('❌ Error en seeder:', error);
        }
    }
}
