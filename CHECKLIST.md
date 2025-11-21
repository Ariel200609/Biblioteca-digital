# 📋 Checklist de Instalación

Usa este checklist para asegurarte de que todo está configurado correctamente:

## ✅ Pre-requisitos instalados

- [ ] **Node.js** instalado (`node --version`)
- [ ] **npm** instalado (`npm --version`)
- [ ] **MySQL** instalado y ejecutándose
- [ ] **Git** instalado

## ✅ Proyecto clonado y dependencias

- [ ] Repositorio clonado: `git clone https://github.com/Ariel200609/Biblioteca-digital.git`
- [ ] Dependencias instaladas: `npm install`
- [ ] Carpeta `node_modules` existe

## ✅ Base de Datos

- [ ] Archivo `.env` creado en la raíz del proyecto
- [ ] Valores de `.env` configurados:
  ```
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=1234
  DB_NAME=biblioteca_digital
  ```
- [ ] Base de datos creada en MySQL (ejecutar `npm run db:setup`)
- [ ] MySQL está corriendo

## ✅ Servidor iniciado

- [ ] Ejecutar: `npm run dev`
- [ ] Ver mensaje: `✅ Base de datos MySQL inicializada correctamente`
- [ ] Acceder a: `http://localhost:3000`

## ✅ Tests (Opcional)

- [ ] Ejecutar: `npm test`
- [ ] Ver tests pasando (✓)

---

## 🎯 Si todo está marcado ✅

¡Felicidades! El proyecto está listo para usar.

**Próximos pasos:**
1. Explora los endpoints con Postman
2. Lee el código en `src/Backend/`
3. Modifica algo pequeño para entender cómo funciona

---

## 🚨 Si algo no está marcado

Revisa la sección "Troubleshooting" en `README.md` o `GUIA_RAPIDA.md`
