import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';
import type { ActiveLoansReport, ActiveUsersReport, BookStatisticsReport } from '../api/client';
import '../CSS/Reports.css';

export default function Reports() {
  const [activeLoans, setActiveLoans] = useState<ActiveLoansReport | null>(null);
  const [activeUsers, setActiveUsers] = useState<ActiveUsersReport | null>(null);
  const [bookStats, setBookStats] = useState<BookStatisticsReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [al, au, bs] = await Promise.all([
          apiGet<ActiveLoansReport>('/reports/loans/active'),
          apiGet<ActiveUsersReport>('/reports/users/active'),
          apiGet<BookStatisticsReport>('/reports/books/statistics'),
        ]);
        setActiveLoans(al);
        setActiveUsers(au);
        setBookStats(bs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{padding: '2rem', textAlign: 'center'}}>Generando reportes...</div>;

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Dashboard Analítico</h2>
        <p style={{color:'#666'}}>Estadísticas generales del sistema</p>
      </div>

      <div className="reports-grid">
        
        {/* Columna 1: Métricas de Préstamos */}
        <div className="report-card">
          <h3>📊 Actividad de Préstamos</h3>
          {activeLoans && (
            <>
              <div className="metric-big" style={{color: '#646cff'}}>
                {activeLoans.totalActiveLoans}
              </div>
              <div className="metric-label">Préstamos Activos</div>
              
              <div style={{marginTop: '2rem'}}>
                <ul className="stat-list">
                  <li className="stat-item">
                    <span>Al día</span>
                    <span style={{color: '#10b981'}}>
                      {activeLoans.loans.filter(l => !l.isOverdue).length}
                    </span>
                  </li>
                  <li className="stat-item">
                    <span>Vencidos</span>
                    <span style={{color: '#ef4444'}}>
                      {activeLoans.loans.filter(l => l.isOverdue).length}
                    </span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Columna 2: Métricas de Usuarios */}
        <div className="report-card">
          <h3>👥 Comunidad</h3>
          {activeUsers && (
            <>
              <div className="metric-big" style={{color: '#10b981'}}>
                {activeUsers.totalUsers}
              </div>
              <div className="metric-label">Usuarios Registrados</div>

              <div style={{marginTop: '2rem'}}>
                <ul className="stat-list">
                  <li className="stat-item">
                    <span>Activos</span>
                    <span>{activeUsers.activeUsers}</span>
                  </li>
                  <li className="stat-item">
                    <span>Con préstamos</span>
                    <span>{activeUsers.usersWithLoans}</span>
                  </li>
                  <li className="stat-item">
                    <span>Con morosidad</span>
                    <span style={{color: '#ef4444'}}>{activeUsers.usersWithOverdueLoans}</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Columna 3: Inventario */}
        <div className="report-card">
          <h3>📚 Inventario</h3>
          {bookStats && (
            <ul className="stat-list">
              <li className="stat-item">
                <span>Total Libros</span>
                <span>{bookStats.totalBooks}</span>
              </li>
              <li className="stat-item">
                <span>Disponibles</span>
                <span>{bookStats.availableBooks}</span>
              </li>
              <li className="stat-item">
                <span>Prestados</span>
                <span>{bookStats.loanedBooks}</span>
              </li>
            </ul>
          )}
        </div>

      </div>

      {/* Sección Inferior: Top Libros */}
      {bookStats && bookStats.mostBorrowedBooks.length > 0 && (
        <div className="report-card" style={{maxWidth: '100%'}}>
          <h3>🏆 Libros Más Populares</h3>
          <div className="top-books-list">
            {bookStats.mostBorrowedBooks.map((book, index) => (
              <div key={book.bookId} className="book-rank-item">
                <div className="rank-info">
                  <span className="rank-title">
                    #{index + 1} ID: {book.bookId.slice(0,8)}...
                  </span>
                  <span className="rank-count">{book.timesLoaned} préstamos</span>
                </div>
                {/* Barra visual basada en popularidad relativa */}
                <div 
                  className="rank-bar" 
                  style={{
                    width: `${(book.timesLoaned / bookStats.mostBorrowedBooks[0].timesLoaned) * 100}%`
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}