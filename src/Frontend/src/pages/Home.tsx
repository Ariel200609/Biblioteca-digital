import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/client';
import '../CSS/Home.css';

// Tipos para los datos que vamos a mostrar
interface DashboardStats {
  totalBooks: number;
  activeLoans: number;
  totalUsers: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    activeLoans: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Hacemos las peticiones en paralelo para que cargue rápido
        const [booksData, loansData, usersData] = await Promise.all([
          apiGet<any>('/reports/books/statistics'),
          apiGet<any>('/reports/loans/active'),
          apiGet<any>('/reports/users/active')
        ]);

        setStats({
          totalBooks: booksData.totalBooks || 0,
          activeLoans: loansData.totalActiveLoans || 0,
          totalUsers: usersData.totalUsers || 0
        });
      } catch (error) {
        console.error("Error cargando estadísticas", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Panel de Control</h1>
        <p className="hero-subtitle">Bienvenido a la gestión centralizada de tu biblioteca</p>
      </section>

      <div className="dashboard-grid">
        
        {/* Tarjeta de Libros */}
        <Link to="/books" className="dashboard-card">
          <div className="card-top">
            <div className="card-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <div className="card-content">
              <h3>Libros</h3>
              <p>Administrar catálogo</p>
            </div>
          </div>
          <div className="card-stat">
            {loading ? '...' : stats.totalBooks}
          </div>
        </Link>

        {/* Tarjeta de Usuarios */}
        <Link to="/users" className="dashboard-card">
          <div className="card-top">
            <div className="card-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="card-content">
              <h3>Usuarios</h3>
              <p>Lectores y Staff</p>
            </div>
          </div>
          <div className="card-stat">
            {loading ? '...' : stats.totalUsers}
          </div>
        </Link>

        {/* Tarjeta de Préstamos */}
        <Link to="/loans" className="dashboard-card">
          <div className="card-top">
            <div className="card-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </div>
            <div className="card-content">
              <h3>Préstamos</h3>
              <p>Activos y Devoluciones</p>
            </div>
          </div>
          <div className="card-stat">
            {loading ? '...' : stats.activeLoans}
          </div>
        </Link>

        {/* Tarjeta de Reportes (Sin estadística, solo acceso) */}
        <Link to="/reports" className="dashboard-card">
          <div className="card-top">
            <div className="card-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div className="card-content">
              <h3>Reportes</h3>
              <p>Ver análisis completo</p>
            </div>
          </div>
          <div className="card-stat" style={{fontSize: '1rem', color: '#646cff'}}>
            Ver detalles →
          </div>
        </Link>

      </div>
    </div>
  );
}