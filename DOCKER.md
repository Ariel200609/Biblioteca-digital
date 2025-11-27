# 🐳 Docker Setup - Biblioteca Digital

## Descripción
Esta configuración de Docker Compose levanta toda la aplicación con:
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + Vite
- **Base de Datos**: MySQL 8.0

## 📋 Requisitos previos
- Docker instalado ([Descargar](https://www.docker.com/products/docker-desktop))
- Docker Compose instalado (viene incluido en Docker Desktop)

## 🚀 Inicio rápido

### 1. Configurar variables de entorno
```bash
cp .env.example .env
```

### 2. Levantar los contenedores
```bash
docker-compose up -d
```

### 3. Verificar que todo funciona
```bash
# Verificar contenedores activos
docker-compose ps

# Revisar logs
docker-compose logs -f
```

### 4. Acceder a la aplicación
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3306

## 📝 Comandos útiles

### Iniciar servicios
```bash
docker-compose up -d          # Iniciar en background
docker-compose up             # Iniciar mostrando logs
```

### Ver logs
```bash
docker-compose logs -f                    # Todos los servicios
docker-compose logs -f backend            # Solo backend
docker-compose logs -f db                 # Solo base de datos
docker-compose logs -f frontend           # Solo frontend
```

### Detener servicios
```bash
docker-compose down           # Detener todos los servicios
docker-compose down -v        # Detener y eliminar volúmenes
```

### Reiniciar servicios
```bash
docker-compose restart                    # Todos
docker-compose restart backend            # Solo backend
```

### Acceder al contenedor
```bash
# Backend
docker-compose exec backend sh

# Base de datos
docker-compose exec db bash

# Frontend
docker-compose exec frontend sh
```

### Conectarse a MySQL desde el host
```bash
mysql -h 127.0.0.1 -u biblioteca -p -D biblioteca_digital
# Contraseña: biblioteca123
```

## 🔧 Variables de entorno (.env)

```env
# Base de datos
MYSQL_ROOT_PASSWORD=root
MYSQL_USER=biblioteca
MYSQL_PASSWORD=biblioteca123
MYSQL_DATABASE=biblioteca_digital
DB_PORT=3306

# Backend
NODE_ENV=development
PORT=3000

# Frontend
VITE_API_URL=http://localhost:3000/api
FRONTEND_PORT=5173
```

## 🐛 Solución de problemas

### El puerto 3000 o 5173 ya está en uso
Cambiar los puertos en `.env`:
```env
PORT=3001              # Backend
FRONTEND_PORT=5174     # Frontend
```

### La base de datos no se conecta
1. Verificar que el contenedor de MySQL está corriendo:
   ```bash
   docker-compose logs db
   ```
2. Esperar a que la base de datos esté lista (healthcheck)
3. Reiniciar backend:
   ```bash
   docker-compose restart backend
   ```

### Eliminar todo y empezar de cero
```bash
docker-compose down -v
docker-compose up -d
```

### Ver detalles del servicio
```bash
docker-compose exec backend npm run build
docker-compose exec db mysql -u root -proot -e "SHOW DATABASES;"
```

## 📊 Estructura de volúmenes

- **mysql_data**: Persiste los datos de la base de datos entre contenedores
- **node_modules**: Evita sincronizar node_modules entre host y contenedor

## 🔄 Flujo de desarrollo

1. Backend y Frontend se inician en modo desarrollo con hot-reload
2. Los cambios en `src/` se reflejan automáticamente
3. La base de datos persiste en el volumen `mysql_data`
4. Usa `docker-compose logs -f` para ver los cambios en tiempo real

## 📚 Más información

Ver `README.md` principal para más detalles sobre la aplicación.
