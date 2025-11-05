import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Interfaz para los datos de prueba
interface TestData {
    book: any;
    user: any;
    loan: any;
}

// Función para formatear la respuesta
const formatResponse = (method: string, path: string, response: any) => {
    console.log(`\n${method} ${path}`);
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
};

// Función principal para probar todas las rutas
async function testAllRoutes() {
    const testData: TestData = {
        book: null,
        user: null,
        loan: null
    };

    try {
        console.log('🏁 Iniciando pruebas de API...\n');

        // Test rutas de libros
        console.log('📚 Probando rutas de libros...');
        
        // GET /books
        const booksResponse = await axios.get(`${API_URL}/books`);
        formatResponse('GET', '/books', booksResponse);

        // GET /books/search?query=harry
        const searchResponse = await axios.get(`${API_URL}/books/search`, {
            params: { query: 'harry' }
        });
        formatResponse('GET', '/books/search?query=harry', searchResponse);

        // Si hay libros, probar get by id
        if (booksResponse.data.length > 0) {
            const bookId = booksResponse.data[0].id;
            const bookDetailResponse = await axios.get(`${API_URL}/books/${bookId}`);
            formatResponse('GET', `/books/${bookId}`, bookDetailResponse);
        }

        // Test rutas de usuarios
        console.log('\n👥 Probando rutas de usuarios...');
        
        // Crear un nuevo usuario
        const newUser = {
            name: 'Usuario Test',
            email: `test${Date.now()}@test.com`,
            password: 'password123'
        };
        
        const createUserResponse = await axios.post(`${API_URL}/users`, newUser);
        formatResponse('POST', '/users', createUserResponse);
        testData.user = createUserResponse.data;

        // GET usuarios
        const usersResponse = await axios.get(`${API_URL}/users`);
        formatResponse('GET', '/users', usersResponse);

        // Test rutas de reportes
        console.log('\n📊 Probando rutas de reportes...');
        
        // Reportes de préstamos activos
        const activeLoansReport = await axios.get(`${API_URL}/reports/loans/active`);
        formatResponse('GET', '/reports/loans/active', activeLoansReport);

        // Reportes de usuarios activos
        const activeUsersReport = await axios.get(`${API_URL}/reports/users/active`);
        formatResponse('GET', '/reports/users/active', activeUsersReport);

        // Estadísticas de libros
        const bookStats = await axios.get(`${API_URL}/reports/books/statistics`);
        formatResponse('GET', '/reports/books/statistics', bookStats);

        // Test rutas de notificaciones
        if (testData.user) {
            console.log('\n🔔 Probando rutas de notificaciones...');
            
            // Obtener notificaciones del usuario
            const userNotifications = await axios.get(`${API_URL}/notifications/user/${testData.user.id}`);
            formatResponse('GET', `/notifications/user/${testData.user.id}`, userNotifications);

            // Marcar todas las notificaciones como leídas
            const markAllRead = await axios.post(`${API_URL}/notifications/user/${testData.user.id}/read-all`);
            formatResponse('POST', `/notifications/user/${testData.user.id}/read-all`, markAllRead);
        }

        console.log('\n✅ Pruebas completadas exitosamente!');

    } catch (error: any) {
        console.error('\n❌ Error durante las pruebas:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

// Ejecutar las pruebas
testAllRoutes();