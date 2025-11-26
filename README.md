# 📚 Biblioteca Digital  
---
> ⚠️ **Nota Importante (Rama `dev-sin-DB`):**
> Esta versión del proyecto funciona con un **Sistema de Archivos JSON (Mock DB)**.
> **No es necesario instalar ni configurar una base de datos (MySQL/SQLite).**
> El sistema ya incluye **datos precargados** (libros, usuarios y préstamos) listos para probar al iniciar.
---
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
| **Singleton** | Servicios (UserService, BookService, LoanService, etc.) | Control centralizado de **datos en memoria** para garantizar una única instancia de cada servicio. |
| **Factory Method** | Usuarios | Creación de instancias para **Administrador**, **Bibliotecario** y **Lector**. |
| **Observer** | Notificaciones | Permite avisar a los usuarios sobre **eventos de préstamos** (creación, devolución, renovación). |
| **Strategy** | Búsquedas de libros | Define distintas **estrategias de búsqueda** (por título, autor, categoría, popularidad). |
| **Template Method** | Reportes | Define estructura común para **generar reportes** de préstamos y usuarios. |
| **Decorator** | Préstamos | **Añade información adicional** a los préstamos de manera dinámica. |

---

## 🚀 Extensiones futuras  
- 💾 **Base de Datos Persistente:** Integrar MySQL/PostgreSQL para persistencia de datos.
- 🔌 **Adapter:** Integración con **APIs externas** de catálogos de libros.  
- 🧾 **Command:** Registrar préstamos como **comandos** para permitir operaciones de **deshacer (undo)**.  
- 🔐 **Autenticación JWT:** Sistema de login y tokens para usuarios.
- 📧 **Notificaciones por Email:** Envío de recordatorios por correo electrónico.
- 📱 **Aplicación Móvil:** Expansión a plataformas móviles con React Native.
  

---

✨ _Proyecto desarrollado como práctica de arquitectura de software y patrones de diseño aplicados en TypeScript/Node.js._

## 🛠️ Instalación y Uso

### ⚙️ Requisitos previos
- **Node.js** v16 o superior
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

#### 3. Iniciar el servidor y frontend

El proyecto está dividido en dos carpetas principales: **Backend** y **Frontend**.

**Opción A: Iniciar ambos simultáneamente (recomendado)**

```bash
npm run dev
```

Esto iniciará:
- 🖥️ Backend en `http://localhost:3000`
- 🌐 Frontend en `http://localhost:5173`

**Opción B: Iniciar por separado**

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

Si todo está correcto, verás:
```
✅ Servidor Backend ejecutándose en http://localhost:3000
✅ Aplicación Frontend ejecutándose en http://localhost:5173
```

> **Nota:** El sistema usa almacenamiento en memoria (in-memory). Los datos se generan automáticamente al iniciar la aplicación y persisten mientras el servidor está activo.

### 📝 Scripts disponibles

| Script | Descripción |
|--------|------------|
| `npm run dev` | Inicia Backend + Frontend simultáneamente |
| `npm run dev:backend` | Inicia solo el Backend en modo desarrollo |
| `npm run dev:frontend` | Inicia solo el Frontend en modo desarrollo |
| `npm run build` | Compila TypeScript para producción |
| `npm start` | Inicia servidor en producción |
| `npm test` | Ejecuta todas las pruebas |
| `npm run test:ui` | Ejecuta tests con interfaz visual |

---

## 🧪 Pruebas

El proyecto incluye una suite completa de pruebas con **Vitest**:

### Ejecutar pruebas
```bash
npm test
```

### Ver resultados con interfaz visual
```bash
npm run test:ui
```

### Tipos de pruebas implementadas

- **Unitarias**: Pruebas de funciones y clases individuales
- **Integración**: Pruebas de componentes trabajando juntos
- **Controladores**: Tests de los controladores de rutas
- **Servicios**: Tests de la lógica de negocio
- **Patrones de Diseño**: Verificación de Factory Method, Strategy, Observer, etc.

### Cobertura actual
✅ 61 tests pasando
- Controllers: 20+ tests
- Services: 15+ tests  
- Factory Pattern: 8+ tests
- Otros: 18+ tests

---

## 🔧 Troubleshooting

### ❌ Error: "Puerto 3000/5173 ya está en uso"
**Causa:** Otro proceso está usando el puerto.

**Solución:**
1. Busca qué proceso está usando el puerto:
   - **Windows:** `netstat -ano | find ":3000"`
   - **Linux/Mac:** `lsof -i :3000`
2. Termina el proceso o usa un puerto diferente

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

### ❌ Los datos desaparecen al reiniciar
**Causa:** El sistema usa almacenamiento en memoria.

**Nota:** Esto es por diseño. Los datos se resetean al reiniciar la aplicación. Se cargan 4 usuarios, 8 libros y 3 préstamos automáticamente en cada inicio.

---

## 📖 Estructura del proyecto

```
Biblioteca-digital/
├── src/
│   ├── app.ts                  # Configuración principal de Express
│   ├── index.ts                # Punto de entrada
│   │
│   ├── Backend/
│   │   ├── config/             # Configuración de aplicación
│   │   ├── controllers/        # Lógica de rutas
│   │   ├── models/             # Clases de datos (User, Book, Loan)
│   │   ├── patterns/           # Patrones de diseño
│   │   │   ├── decorator/      # Decorator para préstamos
│   │   │   ├── factory/        # Factory para usuarios
│   │   │   ├── observer/       # Observer para notificaciones
│   │   │   ├── strategy/       # Strategy para búsquedas
│   │   │   └── template/       # Template para reportes
│   │   ├── routes/             # Definición de rutas API
│   │   ├── services/           # Lógica de negocio (Singletons)
│   │   ├── tests/              # Pruebas unitarias e integración
│   │   └── utils/              # Utilidades y validadores
│   │
│   ├── Frontend/
│   │   ├── src/
│   │   │   ├── pages/          # Componentes de páginas React
│   │   │   ├── CSS/            # Estilos de la aplicación
│   │   │   ├── api/            # Cliente HTTP para Backend
│   │   │   └── assets/         # Recursos estáticos
│   │   ├── vite.config.ts      # Configuración Vite
│   │   └── package.json        # Dependencias del Frontend
│   │
│   └── scripts/
│       └── insertBooks.ts      # Script de seeder de datos
│
├── .env                        # Variables de entorno
├── package.json                # Dependencias principales
├── tsconfig.json               # Configuración TypeScript
└── README.md                   # Este archivo
```

**Descripción de capas:**

- **Controllers:** Manejan solicitudes HTTP y delegan lógica a servicios
- **Services:** Contienen la lógica de negocio (Patrones Singleton)
- **Models:** Definen estructuras de datos (User, Book, Loan, Notification)
- **Patterns:** Implementan patrones de diseño (Factory, Observer, Strategy, etc.)
- **Routes:** Mapean endpoints HTTP a controladores
- **Tests:** Pruebas automáticas con Vitest

---

## 📚 API Reference

> **Nota:** El sistema usa almacenamiento en memoria. Los datos se cargan automáticamente al iniciar:
> - 4 Usuarios (Admin, Bibliotecario, Lector 1, Lector 2)
> - 8 Libros de diferentes categorías
> - 3 Préstamos activos

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
- `type=LOAN_CREATED,LOAN_OVERDUE,LOAN_RETURNED,LOAN_RENEWED`: Filtrar por tipos específicos
- `limit=10`: Limitar número de resultados

**Tipos de notificaciones generadas:**
- `LOAN_CREATED`: Se crea un nuevo préstamo
- `LOAN_RETURNED`: Se devuelve un libro
- `LOAN_RENEWED`: Se renueva un préstamo
- `LOAN_OVERDUE`: Un préstamo vence

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
