// Validador de email
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
};

// Validador de ISBN (soporta ISBN-10 e ISBN-13)
export const isValidISBN = (isbn: string): boolean => {
    // Eliminar guiones y espacios
    isbn = isbn.replace(/[-\s]/g, '');

    // Validar longitud (10 o 13 dígitos)
    if (isbn.length !== 10 && isbn.length !== 13) {
        return false;
    }

    // Validar que todos sean dígitos (excepto posiblemente la última posición de ISBN-10 que puede ser X)
    for (let i = 0; i < isbn.length - 1; i++) {
        if (!/\d/.test(isbn[i])) {
            return false;
        }
    }

    // Para ISBN-10, el último carácter puede ser X
    if (isbn.length === 10) {
        const lastChar = isbn[isbn.length - 1];
        return /[\dX]/.test(lastChar);
    }

    // Para ISBN-13, el último debe ser dígito
    if (isbn.length === 13) {
        return /\d/.test(isbn[isbn.length - 1]);
    }

    return false;
};