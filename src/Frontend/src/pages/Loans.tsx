import { type FormEvent, useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api/client';
import type { Loan, Book, User } from '../api/client';
import Modal from '../pages/Modal';
import '../CSS/Loans.css';


export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'returned'>('active');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ userId: '', bookId: '', dueDate: '' });

  // Carga inicial de TODOS los datos necesarios
  async function loadData() {
    setLoading(true);
    try {
      const [loansData, booksData, usersData] = await Promise.all([
        apiGet<Loan[]>('/loans'),
        apiGet<Book[]>('/books'),
        apiGet<User[]>('/users')
      ]);
      setLoans(loansData);
      setBooks(booksData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }

  // Recargar solo préstamos después de una acción
  async function refreshLoans() {
    const data = await apiGet<Loan[]>('/loans');
    setLoans(data);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Helpers para encontrar nombres
  const getBookTitle = (id: string) => books.find(b => b.id === id)?.title || 'Libro desconocido';
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Usuario desconocido';

  // Filtrado
  const filteredLoans = loans.filter(l => {
    if (filter === 'all') return true;
    if (filter === 'returned') return l.status === 'returned';
    // Active incluye 'active' y 'overdue'
    return l.status === 'active' || l.status === 'overdue';
  });

  // Acciones
  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      // Si no se elige fecha, el Backend calcula 14 días por defecto
      let datePayload = undefined;
      if (form.dueDate) {
        // Convertir string YYYY-MM-DD a fecha ISO válida
        const date = new Date(form.dueDate + 'T00:00:00Z');
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
        datePayload = date.toISOString();
      }
      await apiPost<Loan>('/loans', { ...form, dueDate: datePayload });
      setIsModalOpen(false);
      setForm({ userId: '', bookId: '', dueDate: '' });
      refreshLoans();
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error al crear préstamo: ${error.message}`);
      } else {
        alert('Error al crear préstamo: Libro no disponible o límite de usuario alcanzado.');
      }
    }
  }

  async function onReturn(id: string) {
    if(!confirm('¿Confirmar devolución del libro?')) return;
    await apiPost(`/loans/${id}/return`);
    refreshLoans();
  }

  async function onRenew(id: string) {
    try {
      await apiPost(`/loans/${id}/renew`);
      refreshLoans();
    } catch (error) {
      alert('No se puede renovar (límite alcanzado o vencido)');
    }
  }

  // Determinar clase CSS basada en estado y fecha
  const getLoanStatusClass = (loan: Loan) => {
    if (loan.status === 'returned') return 'loan-returned';
    const isOverdue = new Date(loan.dueDate) < new Date();
    return isOverdue || loan.status === 'overdue' ? 'loan-overdue' : 'loan-active';
  };

  const formatDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="loans-container">
      <div className="loans-header">
        <h2>Préstamos</h2>
        
        <div className="loans-filter">
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Activos
          </button>
          <button 
            className={`filter-btn ${filter === 'returned' ? 'active' : ''}`}
            onClick={() => setFilter('returned')}
          >
            Historial
          </button>
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
        </div>

        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          <span>+</span> Nuevo Préstamo
        </button>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', color: '#666'}}>Cargando datos...</div>
      ) : (
        <div className="loans-grid">
          {filteredLoans.map((l) => {
            const statusClass = getLoanStatusClass(l);
            const isReturned = l.status === 'returned';
            const isOverdue = statusClass === 'loan-overdue';

            return (
              <div key={l.id} className={`loan-ticket ${statusClass}`}>
                <div className="ticket-status-bar"></div>
                <div className="ticket-content">
                  
                  <div className="ticket-header">
                    <span className="ticket-id">#{l.id.slice(0, 6)}</span>
                    <span className="status-badge">
                      {isReturned ? 'Devuelto' : isOverdue ? 'Vencido' : 'Activo'}
                    </span>
                  </div>

                  <h3 className="book-title">{getBookTitle(l.bookId)}</h3>
                  <div className="borrower-name">
                    <span>👤</span> {getUserName(l.userId)}
                  </div>

                  <div className="ticket-dates">
                    <div className="date-group">
                      <span className="date-label">Prestado</span>
                      <span className="date-value">{formatDate(l.loanDate)}</span>
                    </div>
                    <div className="date-group" style={{textAlign: 'right'}}>
                      <span className="date-label">{isReturned ? 'Devuelto' : 'Vence'}</span>
                      <span className={`date-value ${isOverdue && !isReturned ? 'overdue' : ''}`}>
                        {isReturned && (l as any).returnDate 
                          ? formatDate((l as any).returnDate) 
                          : formatDate(l.dueDate)}
                      </span>
                    </div>
                  </div>

                  {!isReturned && (
                    <div className="ticket-actions">
                      <button className="btn-action btn-renew" onClick={() => onRenew(l.id)}>
                        Renovar ({l.renewalCount})
                      </button>
                      <button className="btn-action btn-return" onClick={() => onReturn(l.id)}>
                        Devolver
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nuevo Préstamo */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Registrar Préstamo"
      >
        <form onSubmit={onCreate}>
          <div className="form-group">
            <label>Usuario</label>
            <select 
              className="form-input" 
              value={form.userId} 
              onChange={(e) => setForm({ ...form, userId: e.target.value })} 
              required
            >
              <option value="">Seleccionar usuario...</option>
              {users.filter(u => u.isActive).map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Libro</label>
            <select 
              className="form-input" 
              value={form.bookId} 
              onChange={(e) => setForm({ ...form, bookId: e.target.value })} 
              required
            >
              <option value="">Seleccionar libro...</option>
              {books.filter(b => b.available).map(b => (
                <option key={b.id} value={b.id}>{b.title} - {b.author}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Fecha límite (Opcional)</label>
            <input 
              type="date" 
              className="form-input" 
              value={form.dueDate} 
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })} 
            />
            <small style={{color:'#666', fontSize: '0.8rem'}}>Por defecto son 14 días.</small>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-primary">Crear Préstamo</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}