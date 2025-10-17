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
