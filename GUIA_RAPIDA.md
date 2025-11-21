# 🚀 GUÍA RÁPIDA DE INICIO - Para Principiantes

¡Bienvenido al proyecto Biblioteca Digital! Si eres junior y es tu primer proyecto, esta guía es para ti.

## ⚡ Pasos rápidos (5 minutos)

### 1️⃣ Instala lo que necesitas

Antes de empezar, necesitas:
- **Node.js** → Descárgalo aquí: https://nodejs.org/ (elige LTS)
- **MySQL** → Descárgalo aquí: https://dev.mysql.com/downloads/mysql/

Después de instalar, verifica:
```powershell
node --version
npm --version
mysql --version
```

### 2️⃣ Clona el proyecto

```powershell
git clone https://github.com/Ariel200609/Biblioteca-digital.git
cd Biblioteca-digital
```

### 3️⃣ Instala las dependencias

```powershell
npm install
```

Esto descargará todas las librerías que necesita el proyecto (~5-10 min).

### 4️⃣ Configura la Base de Datos

**A. Crea un archivo llamado `.env` en la carpeta raíz del proyecto**

Copia esto dentro:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=biblioteca_digital
NODE_ENV=development
PORT=3000
```

> Nota: Si cambiaste la contraseña de MySQL durante la instalación, reemplaza `1234` por tu contraseña real.

**B. Abre MySQL y crea la base de datos:**

Opción A - Desde PowerShell:
```powershell
mysql -u root -p
# Te pedirá la contraseña, escribe 1234 (o tu contraseña)
# Luego ejecuta:
CREATE DATABASE biblioteca_digital CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Opción B - Ejecuta el script automático:
```powershell
npm run db:setup
```

### 5️⃣ Inicia el servidor

```powershell
npm run dev
```

Si todo está bien, verás:
```
✅ Base de datos MySQL inicializada correctamente
Servidor ejecutándose en http://localhost:3000
```

¡Ya está! El proyecto está corriendo. 🎉

---

## 🧪 Ejecutar pruebas

```powershell
npm test
```

Esto ejecutará todas las pruebas automatizadas del proyecto.

---

## 📍 Primeros pasos con el proyecto

### Entender la estructura básica

El proyecto está dividido en:
- **Backend** (TypeScript/Express) - La lógica del servidor
- **Database** (TypeORM) - Conexión y entidades de BD
- **Frontend** (React/Vite) - La interfaz que ves

### Ver los endpoints en acción

Una vez que está corriendo, abre Postman o usa `curl`:

```powershell
# Obtener todos los libros
curl http://localhost:3000/api/books

# Obtener todos los usuarios
curl http://localhost:3000/api/users
```

### Explorar el código

Comienza leyendo:
1. `src/Backend/app.ts` - Configuración principal
2. `src/Backend/routes/` - Las rutas disponibles
3. `src/Backend/controllers/` - La lógica de cada ruta

---

## ❌ Si algo no funciona

**Error: "connect ECONNREFUSED"**
- MySQL no está corriendo
- Verifica que MySQL esté iniciado (Services en Windows)

**Error: "No database selected"**
- La BD no existe
- Ejecuta: `npm run db:setup`

**Error: "Module not found"**
- Falta instalar dependencias
- Ejecuta: `npm install`

**Error: ".env not found"**
- Crea el archivo `.env` manualmente (ver paso 4A)

---

## 📚 Recursos útiles

- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de TypeORM](https://typeorm.io/)
- [Guía de MySQL](https://dev.mysql.com/doc/)

---

## ✨ ¿Necesitas ayuda?

- Lee el `README.md` completo
- Revisa la sección de Troubleshooting
- Pregunta a los miembros del equipo

¡Mucho éxito! 🚀
