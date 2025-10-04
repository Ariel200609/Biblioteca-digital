Proyecto: Biblioteca Digital
1) Introducción

El sistema será una plataforma digital para gestionar libros y préstamos. Permitirá a los usuarios registrarse, buscar libros, pedir préstamos y recibir notificaciones sobre devoluciones o novedades.
Los administradores podrán agregar libros, organizar categorías y controlar préstamos.

2) Objetivos

Facilitar la gestión de libros y préstamos.

Ofrecer distintos roles de usuario (administrador, bibliotecario, lector).

Automatizar recordatorios de devolución de libros.

Permitir estrategias de búsqueda y evaluación de libros flexibles.

Simplificar la interacción con el sistema mediante una interfaz clara.

3) Alcance del sistema

El sistema permitirá:

Registrar usuarios y roles.

Agregar y consultar libros por título, autor o categoría.

Realizar préstamos y devoluciones.

Notificar al usuario cuando se acerca la fecha de devolución.

Implementar diferentes estrategias de búsqueda (por autor, por popularidad, por categoría).

Generar reportes básicos de préstamos y usuarios activos.

4) Patrones de diseño aplicados

Factory Method (Usuarios): creación de Administrador, Bibliotecario y Lector.
Singleton (Conexión y Configuración): para la base de datos y logs.
Facade (Operaciones): interfaz simple para gestionar libros, usuarios y préstamos.
Observer (Notificaciones): avisar a los lectores sobre devoluciones próximas o novedades.
Strategy (Búsquedas/Evaluaciones): distintas estrategias de búsqueda de libros (por autor, por popularidad, por género).

5) Extensiones futuras

Adapter: integrar APIs externas de catálogos de libros.
Command: registrar préstamos como comandos para permitir deshacer operaciones.