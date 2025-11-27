# 🚀 Guía de Configuración - Biblioteca Digital

## 📋 Tabla de contenidos
1. [Requisitos previos](#requisitos-previos)
2. [Instalación rápida con Docker](#instalación-rápida-con-docker)
3. [Instalación local sin Docker](#instalación-local-sin-docker)
4. [Verificación de la instalación](#verificación-de-la-instalación)
5. [Primeros pasos](#primeros-pasos)
6. [Solución de problemas](#solución-de-problemas)

---

## Requisitos previos

### Para Docker (Recomendado ⭐)
- **Docker Desktop** v4.0 o superior
  - Descargar: https://www.docker.com/products/docker-desktop
  - Incluye Docker Compose automáticamente
- **Git** (opcional, para clonar el repo)

### Para desarrollo local
- **Node.js** v20 o superior
  - Descargar: https://nodejs.org
  - Verificar: `node --version`
- **npm** v10 o superior
  - Incluido con Node.js
  - Verificar: `npm --version`
- **Git** (opcional)

---

## Instalación rápida con Docker

### ⭐ Opción 1: Pasos manuales

**1. Clonar o descargar el repositorio**
```bash
git clone https://github.com/Ariel200609/Biblioteca-digital.git
cd Biblioteca-digital
```

**2. Copiar archivo de configuración**
```bash
cp .env.example .env
```

**3. Levantar Docker Compose**
```bash
docker-compose up -d
```

**4. Esperar a que esté listo**
```bash
# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f
```

### ✅ Verificar que todo funciona
```bash
# Debería ver 3 contenedores corriendo:
# - biblioteca_db (MySQL)
# - biblioteca_backend (Node.js)
# - biblioteca_frontend (Vite)
```

---

## Instalación local sin Docker

### 1. Clonar el repositorio
```bash
git clone https://github.com/Ariel200609/Biblioteca-digital.git
cd Biblioteca-digital
```

### 2. Instalar dependencias (raíz del proyecto)
```bash
npm install
```

### 3. Instalar dependencias del Frontend
```bash
cd src/Frontend
npm install
cd ../..
```

### 4. Crear archivo de configuración
```bash
cp .env.example .env
```

**Editar `.env` si es necesario:**
```env
NODE_ENV=development
PORT=3000
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:3000/api
```

### 5. Iniciar servicios

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

Esperado:
```
Server running on port 3000
```

**Terminal 2 - Frontend:**
```bash
cd src/Frontend
npm run dev
```

Esperado:
```
VITE v7.2.4  ready in 300 ms
Local:   http://localhost:5173/
```

---

## Verificación de la instalación

### Verificar conectividad

**1. Acceder a la aplicación**
```
Frontend:  http://localhost:5173
Backend:   http://localhost:3000
```

**2. Verificar API**
```bash
# En otra terminal, ejecutar:
curl http://localhost:3000/api/books

# Debería devolver un JSON con libros
```

**3. Verificar que funciona**
- Abrir http://localhost:5173 en el navegador
- Debería cargar la aplicación
- Ver catálogo de libros
- Intentar crear/editar/eliminar un libro

### Con Docker

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs del backend
docker-compose logs backend

# Ver logs del frontend
docker-compose logs frontend

# Verificar salud de MySQL
docker-compose logs db
```

---

## Primeros pasos

### 1. Explorar la aplicación

**Usuarios de prueba disponibles:**
- **Admin**: admin@test.com
- **Lector**: reader@test.com

**Datos precargados:**
- 8 libros de ejemplo
- 4 usuarios con diferentes roles
- 6 préstamos de ejemplo

### 2. Crear un nuevo libro

1. Ir a **Catálogo de Libros**
2. Click en **+ Nuevo Libro**
3. Llenar el formulario:
   - **Título**: Requerido
   - **Autor**: Requerido
   - **ISBN**: Requerido (10 o 13 dígitos válidos)
   - **Categoría**: Seleccionar de la lista
4. Click en **Guardar**

**Categorías disponibles:**
- Novela, Poesía, Teatro, Ensayo, Biografía
- Historia, Filosofía, Psicología, Ciencias
- Tecnología, Arte, Infantil, Juvenil
- Cómic, Referencia, Educación

### 3. Buscar libros

- **Por título**: Escribir en el buscador
- **Por autor**: Cambiar tipo de búsqueda
- **Por categoría**: Cambiar tipo de búsqueda
- **Por popularidad**: Cambiar tipo de búsqueda

### 4. Gestionar préstamos

1. Ir a **Préstamos**
2. Crear un nuevo préstamo:
   - Seleccionar usuario
   - Seleccionar libro
   - Click en **Prestar**
3. Ver préstamos activos
4. Renovar un préstamo
5. Devolver un libro

### 5. Ver reportes

- Acceder a **Reportes** para ver:
  - Préstamos activos
  - Usuarios registrados
  - Inventario de libros
  - Libros más populares

---

## Estructura del proyecto

```
Biblioteca-digital/
├── src/
│   ├── Backend/              # API Express + TypeScript
│   │   ├── controllers/      # Controladores de rutas
│   │   ├── services/         # Lógica de negocio
│   │   ├── models/           # Modelos de datos
│   │   ├── routes/           # Definición de rutas
│   │   ├── patterns/         # Patrones de diseño
│   │   ├── data/             # Almacenamiento JSON
│   │   └── tests/            # Tests unitarios
│   │
│   ├── Frontend/             # React + Vite
│   │   ├── src/
│   │   │   ├── pages/        # Componentes de página
│   │   │   ├── api/          # Cliente HTTP
│   │   │   ├── CSS/          # Estilos
│   │   │   └── assets/       # Recursos estáticos
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── index.ts              # Punto de entrada del servidor
│   └── app.ts                # Configuración de Express
│
├── docker-compose.yml        # Orquestación de contenedores
├── .env.example              # Variables de entorno
├── .gitignore               # Archivos ignorados por git
├── README.md                # Documentación principal
├── DOCKER.md                # Guía Docker detallada
└── SETUP.md                 # Este archivo
```

---

## Scripts disponibles

### Backend
```bash
npm run dev:backend      # Desarrollo con hot-reload
npm run build            # Compilar TypeScript
npm start                # Producción
npm test                 # Ejecutar tests
```

### Frontend
```bash
cd src/Frontend
npm run dev              # Desarrollo con Vite
npm run build            # Compilar para producción
npm run preview          # Vista previa de producción
npm run lint             # Validar código
```

### Docker
```bash
docker-compose up -d                  # Levantar servicios
docker-compose down                   # Detener servicios
docker-compose logs -f                # Ver logs en tiempo real
docker-compose restart backend        # Reiniciar backend
docker-compose exec backend sh        # Acceder a terminal backend
```

---

## Solución de problemas

### ❌ Error: "Port 3000 already in use"

**Solución:**
```bash
# Cambiar puerto en .env
PORT=3001

# O matar el proceso existente:
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### ❌ Docker Desktop no inicia

**Solución:**
```bash
# Reiniciar Docker Desktop
# O ejecutar en terminal:
docker system prune -a
docker-compose down -v
docker-compose up -d
```

### ❌ MySQL no conecta

**Solución:**
```bash
# Verificar logs
docker-compose logs db

# Esperar a que MySQL esté listo (toma ~10 segundos)
docker-compose restart backend

# O eliminar y recrear volumen
docker volume rm biblioteca-digital_mysql_data
docker-compose up -d
```

### ❌ Frontend no carga

**Solución:**
```bash
# Limpiar caché de Vite
rm -rf src/Frontend/.vite
rm -rf src/Frontend/dist
npm run dev

# O desde Docker
docker-compose exec frontend rm -rf .vite
docker-compose restart frontend
```

### ❌ Error de CORS

**Solución:**
- Verificar que backend está en http://localhost:3000
- Verificar `VITE_API_URL` en `.env`
- Reiniciar frontend:
```bash
docker-compose restart frontend
```

### ❌ Base de datos corrupta

**Solución:**
```bash
# Eliminar volumen y recrear
docker-compose down -v
docker-compose up -d
```

---

## Desarrollo

### Hacer cambios

**Backend:**
```bash
# Los cambios se aplican automáticamente con ts-node-dev
# Editar archivos en src/Backend/
# Cambios reflejados al guardar
```

**Frontend:**
```bash
# Los cambios se aplican automáticamente con Vite HMR
# Editar archivos en src/Frontend/src/
# Cambios reflejados inmediatamente en el navegador
```

### Agregar dependencias

**Backend:**
```bash
npm install nombre-paquete
docker-compose restart backend
```

**Frontend:**
```bash
cd src/Frontend
npm install nombre-paquete
docker-compose restart frontend
```

---

## Producción

### Compilar para producción

```bash
# Backend
npm run build

# Frontend
cd src/Frontend
npm run build
```

### Deployar con Docker

```bash
# Editar docker-compose.yml
# Cambiar NODE_ENV a "production"
# Cambiar puertos si es necesario

docker-compose up -d
```

---

## Recursos útiles

- 📖 [Documentación README](./README.md)
- 🐳 [Guía Docker completa](./DOCKER.md)
- 📚 [Documentación Express](https://expressjs.com)
- ⚛️ [Documentación React](https://react.dev)
- ⚡ [Documentación Vite](https://vitejs.dev)
- 🔷 [Documentación TypeScript](https://www.typescriptlang.org)

---

## Soporte

Si encuentras problemas:

1. **Revisar esta guía** en la sección de "Solución de problemas"
2. **Revisar logs**: `docker-compose logs -f`
3. **Abrir issue** en GitHub
4. **Contactar** al equipo de desarrollo

---

**¡Listo para desarrollar! 🚀**

Cualquier pregunta, consulta esta guía o revisa la documentación en README.md
