// Validador de email
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
};

// Validador de ISBN (soporta ISBN-10 e ISBN-13)
export const isValidISBN = (isbn: string): boolean => {
    // Eliminar guiones y espacios
    isbn = isbn.replace(/[-\s]/g, '');

    // Validar longitud
    if (isbn.length !== 10 && isbn.length !== 13) {
        return false;
    }

    // Validar ISBN-10
    if (isbn.length === 10) {
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            const digit = parseInt(isbn.charAt(i));
            if (isNaN(digit)) return false;
            sum += (10 - i) * digit;
        }

        // El último dígito puede ser 'X' (que representa 10)
        const lastChar = isbn.charAt(9).toUpperCase();
        const lastDigit = lastChar === 'X' ? 10 : parseInt(lastChar);
        if (isNaN(lastDigit) && lastChar !== 'X') return false;

        sum += lastDigit;
        return sum % 11 === 0;
    }

    // Validar ISBN-13
    if (isbn.length === 13) {
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            const digit = parseInt(isbn.charAt(i));
            if (isNaN(digit)) return false;
            sum += (i % 2 === 0 ? 1 : 3) * digit;
        }

        const checkDigit = parseInt(isbn.charAt(12));
        if (isNaN(checkDigit)) return false;

        return (10 - (sum % 10)) % 10 === checkDigit;
    }

    return false;
};