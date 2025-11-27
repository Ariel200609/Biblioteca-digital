-- Script de población de datos de ejemplo
USE biblioteca_digital;

-- Insertar usuarios
INSERT INTO users (id, name, email, password, role, createdAt, updatedAt) VALUES
('1', 'Admin User', 'admin@test.com', 'password123', 'admin', NOW(), NOW()),
('2', 'Lector Test', 'reader@test.com', 'password123', 'reader', NOW(), NOW()),
('3', 'Juan Pérez', 'juan@test.com', 'password123', 'reader', NOW(), NOW()),
('4', 'María García', 'maria@test.com', 'password123', 'librarian', NOW(), NOW());

-- Insertar libros
INSERT INTO books (id, title, author, isbn, category, description, publishedYear, copies, available, createdAt, updatedAt) VALUES
('1764114535276', '1984', 'George Orwell', '9780452284234', 'Novela', 'Una novela distópica de control totalitario', 1949, 3, 3, NOW(), NOW()),
('1764114535277', 'Cien años de soledad', 'Gabriel García Márquez', '9788432233055', 'Novela', 'La historia de la familia Buendía en Macondo', 1967, 2, 2, NOW(), NOW()),
('1764114535278', 'El hobbit', 'J.R.R. Tolkien', '9788432207887', 'Infantil', 'Las aventuras de Bilbo Bolsón', 1937, 3, 3, NOW(), NOW()),
('1764114535279', 'Breve historia del tiempo', 'Stephen Hawking', '9788474329266', 'Ciencias', 'Explicación de física y cosmología', 1988, 2, 2, NOW(), NOW()),
('1764114535280', 'El quijote', 'Miguel de Cervantes', '9788426182609', 'Novela', 'Las aventuras de Don Quijote de la Mancha', 1605, 1, 1, NOW(), NOW()),
('1764114535281', 'Sapiens', 'Yuval Noah Harari', '9788498387032', 'No ficción', 'Una historia breve de la humanidad', 2014, 2, 2, NOW(), NOW());

-- Insertar notificaciones de ejemplo
INSERT INTO notifications (id, userId, message, type, `read`, createdAt) VALUES
('notif-1', '2', 'Bienvenido a la Biblioteca Digital', 'loan_approved', 0, NOW()),
('notif-2', '3', 'Tu préstamo está próximo a vencer', 'reminder', 0, DATE_SUB(NOW(), INTERVAL 1 DAY));
