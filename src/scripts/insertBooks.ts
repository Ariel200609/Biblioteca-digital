import { AppDataSource, initializeDatabase } from '../Database/config/database.config';
import { Book } from '../Database/entities/Book.entity';

async function insertBooks() {
  try {
    await initializeDatabase();
    const bookRepository = AppDataSource.getRepository(Book);
    
    const booksToCreate = [
      new Book({
        title: 'Cien años de soledad',
        author: 'Gabriel García Márquez',
        isbn: '978-0307474728',
        category: 'Novela',
        description: 'La obra cumbre del realismo mágico que narra la historia de la familia Buendía'
      }),
      new Book({
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0451524935',
        category: 'Novela',
        description: 'Una distopía que explora temas de vigilancia gubernamental y control social'
      }),
      new Book({
        title: 'El principito',
        author: 'Antoine de Saint-Exupéry',
        isbn: '978-0156012195',
        category: 'Infantil',
        description: 'Un clásico de la literatura que explora temas de amor, amistad y el sentido de la vida'
      }),
      new Book({
        title: 'Don Quijote de la Mancha',
        author: 'Miguel de Cervantes',
        isbn: '978-8424922047',
        category: 'Novela',
        description: 'La obra más importante de la literatura española y una de las obras cumbre de la literatura universal'
      }),
      new Book({
        title: 'Harry Potter y la piedra filosofal',
        author: 'J.K. Rowling',
        isbn: '978-8478884452',
        category: 'Juvenil',
        description: 'El primer libro de la saga que sigue las aventuras del joven mago Harry Potter'
      })
    ];

    for (const book of booksToCreate) {
      const newBook = await bookRepository.save(book);
      console.log(`Libro creado: ${newBook.title}`);
    }

    console.log('Todos los libros han sido insertados exitosamente');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error al insertar libros:', error);
    process.exit(1);
  }
}

insertBooks();