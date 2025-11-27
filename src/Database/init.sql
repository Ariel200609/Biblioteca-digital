-- Script de inicialización de la base de datos Biblioteca Digital
-- Este archivo se ejecuta automáticamente cuando Docker inicia el contenedor MySQL

USE biblioteca_digital;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'librarian', 'reader') NOT NULL DEFAULT 'reader',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de libros
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) UNIQUE,
    category VARCHAR(100),
    description TEXT,
    publishedYear INT,
    copies INT NOT NULL DEFAULT 1,
    available INT NOT NULL DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_category (category)
);

-- Crear tabla de préstamos
CREATE TABLE IF NOT EXISTS loans (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    bookId VARCHAR(36) NOT NULL,
    loanDate TIMESTAMP NOT NULL,
    dueDate TIMESTAMP NOT NULL,
    returnDate TIMESTAMP,
    status ENUM('active', 'returned', 'overdue') NOT NULL DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_bookId (bookId),
    INDEX idx_status (status)
);

-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('reminder', 'new_book', 'loan_approved', 'loan_rejected') NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_read (read)
);

-- Crear tabla de reportes
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    data JSON,
    generatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy VARCHAR(36),
    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_type (type)
);
