# 📚 Biblioteca Digital – Frontend

Interfaz web construida con React y Vite para gestionar la biblioteca digital. Consume la API REST del backend (`/api`) para administrar libros, usuarios, préstamos, notificaciones y reportes.

---
> ⚠️ **Nota Importante (Rama `dev-sin-DB`):**
> Esta versión del proyecto funciona con un **Sistema de Archivos JSON (Mock DB)**.
> **No es necesario instalar ni configurar una base de datos (MySQL/SQLite).**
> El sistema ya incluye **datos precargados** (libros, usuarios y préstamos) listos para probar al iniciar.
---

## 🚀 Tecnologías principales

- React 19 con React Router DOM 7
- TypeScript
- Vite 7

---

## 🛠️ Configuración y ejecución

```bash
cd Frontend/biblioteca-frontend
npm install
npm run dev
```

La aplicación se sirve en `http://localhost:5173`. Para que todas las vistas funcionen, el backend debe estar corriendo en `http://localhost:3000`.

Si tu backend vive en otra URL, define `VITE_API_URL` antes de iniciar Vite:

```bash
VITE_API_URL="http://mi-backend:3000/api" npm run dev
```

---

## 🧭 Secciones principales

| Vista | Ruta | Descripción |
| --- | --- | --- |
| Inicio | `/` | Resumen general |
| Libros | `/books` | Listado, creación, edición y eliminación |
| Usuarios | `/users` | CRUD de usuarios (Admin, Librarian, Reader) |
| Préstamos | `/loans` | Crear préstamos, renovar, devolver |
| Reportes | `/reports` | Estadísticas de préstamos, usuarios y libros |
| Notificaciones | `/notifications` | Ver y marcar notificaciones por usuario |

---

## 🔌 Comunicación con el backend

Todos los requests salen de los servicios en `src/api/client.ts`. Ahí se arma la URL base (`API_BASE_URL`), se manejan los `fetch` y se definen los tipos de datos que llegan desde la API.

---

## 📂 Estructura destacada

```
src/
├── api/
│   └── client.ts      # Cliente REST y tipos compartidos
├── pages/
│   ├── Books.tsx
│   ├── Users.tsx
│   ├── Loans.tsx
│   ├── Reports.tsx
│   ├── Notifications.tsx
│   └── Home.tsx
├── App.tsx            # Enrutamiento principal
└── main.tsx           # Arranque de React + Router
```

---

## 🧪 Scripts disponibles

- `npm run dev`: servidor de desarrollo (Vite)
- `npm run build`: build de producción (TypeScript + Vite)
- `npm run lint`: corre ESLint sobre el código fuente
- `npm run preview`: vista previa del build

---

## ✅ Requisitos previos

- Node.js 20 o superior
- Backend corriendo en `http://localhost:3000` (o configurar `VITE_API_URL`)

---

## 👥 Equipo

- Gianfranco Robles
- Lucas Peratta
- Ariel Montoya
- Dietrich Camilo


