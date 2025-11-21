import { Link, useLocation } from 'react-router-dom';
import '../CSS/Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo / Marca */}
        <Link to="/" className="navbar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <span>Biblioteca<span className="highlight">Digital</span></span>
        </Link>

        {/* Enlaces de Navegación */}
        <nav className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Inicio</Link>
          <Link to="/books" className={`nav-link ${isActive('/books') ? 'active' : ''}`}>Libros</Link>
          <Link to="/users" className={`nav-link ${isActive('/users') ? 'active' : ''}`}>Usuarios</Link>
          <Link to="/loans" className={`nav-link ${isActive('/loans') ? 'active' : ''}`}>Préstamos</Link>
          <Link to="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''}`}>Reportes</Link>
          <Link to="/notifications" className={`nav-link ${isActive('/notifications') ? 'active' : ''}`}>
            <span className="icon">🔔</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}