# 📚 Biblioteca Digital  

## 🧩 Introducción  
**Biblioteca Digital** es una plataforma para la **gestión integral de libros y préstamos**.  
Permite a los usuarios **registrarse, buscar libros, solicitar préstamos y recibir notificaciones** sobre devoluciones o novedades.  

Los **administradores** pueden **agregar libros**, **organizar categorías** y **controlar préstamos**, mientras que los **bibliotecarios** gestionan la operación diaria del sistema.  

---

## 🎯 Objetivos  
- 📖 Facilitar la gestión de libros y préstamos.  
- 👥 Ofrecer distintos **roles de usuario** (Administrador, Bibliotecario, Lector).  
- ⏰ Automatizar **recordatorios de devolución** de libros.  
- 🔎 Implementar **estrategias flexibles de búsqueda y evaluación** de libros.  
- 💡 Simplificar la interacción con el sistema mediante una **interfaz clara y accesible**.  

---

## 📈 Alcance del sistema  
El sistema permitirá:  
- 🧍 Registrar **usuarios y roles**.  
- 📚 **Agregar y consultar libros** por título, autor o categoría.  
- 🔄 **Realizar préstamos y devoluciones**.  
- 📩 **Notificar** a los usuarios cuando se acerque la fecha de devolución.  
- 🧠 Implementar **estrategias de búsqueda** (por autor, popularidad, categoría, etc.).  
- 📊 Generar **reportes básicos** de préstamos y usuarios activos.  

---

## 🏗️ Patrones de diseño aplicados  
| 🧱 Patrón | 🧩 Aplicación | 📖 Descripción |
|:--|:--|:--|
| **Factory Method** | Usuarios | Creación de instancias para **Administrador**, **Bibliotecario** y **Lector**. |
| **Singleton** | Conexión y Configuración | Control centralizado para **base de datos** y **logs**. |
| **Facade** | Operaciones | Interfaz simplificada para **gestionar libros, usuarios y préstamos**. |
| **Observer** | Notificaciones | Permite avisar a los lectores sobre **devoluciones próximas o novedades**. |
| **Strategy** | Búsquedas y Evaluaciones | Define distintas **estrategias de búsqueda** (por autor, popularidad, género, etc.). |

---

## 🚀 Extensiones futuras  
- 🔌 **Adapter:** Integración con **APIs externas** de catálogos de libros.  
- 🧾 **Command:** Registrar préstamos como **comandos** para permitir operaciones de **deshacer (undo)**.  

---

✨ _Proyecto desarrollado como práctica de arquitectura de software y patrones de diseño aplicados en TypeScript/Node.js._

## 🛠️ Instalación y Uso

### ⚙️ Requisitos previos
- **Node.js** v16 o superior
- **MySQL** v5.7 o superior (o MariaDB)
- **npm** v7 o superior

### 📋 Pasos de instalación

#### 1. Clonar el repositorio
```bash
git clone https://github.com/Ariel200609/Biblioteca-digital.git
cd Biblioteca-digital
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. ⚠️ Configurar la Base de Datos

**A. Crear archivo `.env` (copiar desde `.env.example` o crear manualmente):**

En la raíz del proyecto, crea un archivo llamado `.env` con:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=biblioteca_digital
NODE_ENV=development
PORT=3000
```

> **Nota:** Si cambiaste la contraseña de MySQL, reemplaza `1234` con tu contraseña real

**B. Inicializar la base de datos (elige una opción):**

```bash
# Opción 1: Script automático (recomendado)
npm run db:setup

# Opción 2: Si la BD ya existe
npm run db:sync
```

#### 4. Iniciar el servidor
```bash
npm run dev
```

Si todo está correcto, verás:
```
✅ Base de datos MySQL inicializada correctamente
Servidor ejecutándose en http://localhost:3000
```

### 📝 Scripts disponibles

| Script | Descripción |
|--------|------------|
| `npm run build` | Compila TypeScript para producción |
| `npm run build:watch` | Compila en modo watch |
| `npm start` | Inicia servidor en producción |
| `npm test` | Ejecuta pruebas unitarias |
| `npm run test:ui` | Ejecuta tests con interfaz visual |
| `npm run db:setup` | Crea BD e inicializa tablas |
| `npm run db:sync` | Sincroniza entidades con BD |
| `npm run db:test` | 🧪 Prueba la conexión a BD |
| `npm run migration:generate` | Genera migración de cambios |
| `npm run migration:run` | Ejecuta migraciones pendientes |
| `npm run migration:revert` | Revierte última migración |

---

## 🧪 Pruebas

El proyecto incluye pruebas completas:

### Ejecutar pruebas
```bash
npm test
```

### Ver resultados con interfaz visual
```bash
npm run test:ui
```

### Tipos de pruebas

- **Unitarias**: Pruebas de funciones y clases individuales
- **Integración**: Pruebas de componentes trabajando juntos
- **Patrón Factory**: Verificación del patrón de diseño Factory Method
- **Controladores**: Tests de los controladores de rutas
- **Servicios**: Tests de la lógica de negocio

### Cobertura actual
✅ 67+ tests pasando
- Factory Method: 8 tests
- Services: 7 tests  
- Controllers: 16 tests
- Integration: 27 tests
- Reports: 3 tests
- Otros: 6+ tests

---

## 🧪 Verificar que la BD está funcionando

Después de configurar todo, puedes probar la conexión:

```bash
npm run db:test
```

Si todo está bien, verás:
```
✅ Conexión exitosa a la base de datos

📈 Cantidad de registros:

   ✓ users: 0 registros
   ✓ books: 9 registros
   ✓ loans: 0 registros
   ✓ notifications: 0 registros

✨ Prueba completada exitosamente
```

---

## 🔧 Troubleshooting

### ❌ Error: "connect ECONNREFUSED 127.0.0.1:3306"
**Causa:** MySQL no está corriendo.

**Solución:**
1. Verifica que MySQL esté iniciado:
   - **Windows:** Busca "MySQL80" en Services
   - **Linux/Mac:** Ejecuta `mysql -u root -p`
2. Revisa credenciales en `.env` (DB_HOST, DB_USER, DB_PASSWORD)

---

### ❌ Error: "ER_NO_DB_ERROR: No database selected"
**Causa:** La base de datos no existe.

**Solución:**
```bash
npm run db:setup
```

---

### ❌ Error: "npm: command not found"
**Causa:** Node.js no está instalado.

**Solución:** Descarga Node.js desde https://nodejs.org/ (LTS recomendado)

---

### ❌ Error: "Module not found"
**Causa:** Dependencias no instaladas.

**Solución:**
```bash
npm install
```

---

### ❌ Error: ".env not found"
**Solución:** Crea el archivo `.env` manualmente en la raíz del proyecto

---

## 📖 Estructura del proyecto

```
Biblioteca-digital/
├── src/
│   ├── Backend/
│   │   ├── config/          # Configuración de BD
│   │   ├── controllers/     # Lógica de rutas
│   │   ├── models/          # Clases de datos
│   │   ├── patterns/        # Patrones de diseño
│   │   ├── routes/          # Definición de rutas
│   │   ├── services/        # Lógica de negocio
│   │   ├── tests/           # Pruebas unitarias
│   │   └── utils/           # Utilidades
│   │
│   ├── Database/
│   │   ├── config/          # Configuración TypeORM
│   │   └── entities/        # Entidades (User, Book, Loan, etc.)
│   │
│   └── Frontend/
│       └── src/             # Componentes React
│
├── .env.example             # Plantilla de variables
├── package.json             # Dependencias
└── README.md                # Este archivo
```

---

## 📚 API Reference

#### Obtener todos los libros
```http
GET /api/books
```

#### Buscar libros
```http
GET /api/books/search?type=title&query=harry
```
Tipos de búsqueda disponibles:
- `title`: Buscar por título
- `author`: Buscar por autor
- `popularity`: Obtener los 10 libros más populares

#### Obtener un libro por ID
```http
GET /api/books/:id
```

#### Crear un nuevo libro
```http
POST /api/books
```
```json
{
  "title": "El Quijote",
  "author": "Miguel de Cervantes",
  "isbn": "978-84-376-0494-7",
  "category": "Novela",
  "description": "La obra cumbre de la literatura española"
}
```

#### Actualizar un libro
```http
PUT /api/books/:id
```

#### Eliminar un libro
```http
DELETE /api/books/:id
```

### Endpoints de Usuarios

#### Obtener todos los usuarios
```http
GET /api/users
```

#### Obtener un usuario por ID
```http
GET /api/users/:id
```

#### Crear un nuevo usuario
```http
POST /api/users
```
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "role": "reader"
}
```

#### Actualizar un usuario
```http
PUT /api/users/:id
```

#### Eliminar un usuario
```http
DELETE /api/users/:id
```

### Endpoints de Préstamos

#### Obtener todos los préstamos
```http
GET /api/loans
```
Retorna la lista de todos los préstamos.

#### Obtener préstamo por ID
```http
GET /api/loans/:id
```
Retorna un préstamo específico con detalles del libro y usuario.

#### Obtener préstamos activos de un usuario
```http
GET /api/loans/user/:userId
```
Retorna todos los préstamos activos de un usuario específico.

#### Crear nuevo préstamo
```http
POST /api/loans
```
```json
{
  "userId": "123",
  "bookId": "456",
  "dueDate": "2025-11-12T00:00:00.000Z"
}
```
Crea un nuevo préstamo. La fecha de vencimiento (dueDate) es opcional, por defecto será 14 días desde la creación.

#### Devolver un libro
```http
POST /api/loans/:id/return
```
Marca un préstamo como devuelto y hace el libro disponible nuevamente.

#### Renovar un préstamo
```http
POST /api/loans/:id/renew
```
Extiende la fecha de vencimiento del préstamo. Limitado a 2 renovaciones por préstamo.

### Respuestas de error comunes

```json
{
  "error": "Book is not available for loan"
}
```

```json
{
  "error": "User has reached maximum number of active loans"
}
```

```json
{
  "error": "Maximum number of renewals reached"
}
```

```json
{
  "error": "Overdue loans cannot be renewed"
}
```

### Endpoints de Notificaciones

#### Obtener notificaciones del usuario
```http
GET /api/notifications/user/:userId
```

Query params opcionales:
- `unreadOnly=true`: Solo notificaciones no leídas
- `type=LOAN_DUE,LOAN_OVERDUE`: Filtrar por tipos específicos
- `limit=10`: Limitar número de resultados

#### Marcar notificación como leída
```http
POST /api/notifications/user/:userId/:notificationId/read
```
Marca una notificación específica como leída.

#### Marcar todas las notificaciones como leídas
```http
POST /api/notifications/user/:userId/read-all
```
Marca todas las notificaciones del usuario como leídas.

### Endpoints de Reportes

#### Obtener reporte de préstamos activos
```http
GET /api/reports/loans/active
```
Retorna información detallada sobre todos los préstamos activos.

#### Obtener reporte de usuarios activos
```http
GET /api/reports/users/active
```
Retorna estadísticas sobre usuarios activos y sus préstamos.

#### Obtener estadísticas de libros
```http
GET /api/reports/books/statistics
```
Retorna estadísticas detalladas sobre los libros, incluyendo:
- Total de libros
- Libros disponibles
- Libros prestados
- Libros más populares
- Libros vencidos

## Miembros del proyecto 

---
- Gianfranco Robles
- Lucas Peratta
- Ariel Montoya 
- Dietrich Camilo
