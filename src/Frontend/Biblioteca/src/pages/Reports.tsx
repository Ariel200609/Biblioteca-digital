import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';
import type { ActiveLoansReport, ActiveUsersReport, BookStatisticsReport } from '../api/client';

export default function Reports() {
  const [activeLoans, setActiveLoans] = useState<ActiveLoansReport | null>(null);
  const [activeUsers, setActiveUsers] = useState<ActiveUsersReport | null>(null);
  const [bookStats, setBookStats] = useState<BookStatisticsReport | null>(null);

  useEffect(() => {
    (async () => {
      const [al, au, bs] = await Promise.all([
        apiGet<ActiveLoansReport>('/reports/loans/active'),
        apiGet<ActiveUsersReport>('/reports/users/active'),
        apiGet<BookStatisticsReport>('/reports/books/statistics'),
      ]);
      setActiveLoans(al);
      setActiveUsers(au);
      setBookStats(bs);
    })();
  }, []);

  return (
    <div>
      <h2>Reportes</h2>
      <section>
        <h3>Préstamos activos</h3>
        {activeLoans && (
          <div>
            <div>Total: {activeLoans.totalActiveLoans}</div>
          </div>
        )}
      </section>
      <section>
        <h3>Usuarios</h3>
        {activeUsers && (
          <ul>
            <li>Total usuarios: {activeUsers.totalUsers}</li>
            <li>Activos: {activeUsers.activeUsers}</li>
            <li>Con préstamos: {activeUsers.usersWithLoans}</li>
            <li>Con atraso: {activeUsers.usersWithOverdueLoans}</li>
          </ul>
        )}
      </section>
      <section>
        <h3>Libros</h3>
        {bookStats && (
          <ul>
            <li>Total: {bookStats.totalBooks}</li>
            <li>Disponibles: {bookStats.availableBooks}</li>
            <li>Prestados: {bookStats.loanedBooks}</li>
            <li>En mora: {bookStats.overdueBooks}</li>
          </ul>
        )}
      </section>
    </div>
  );
}


