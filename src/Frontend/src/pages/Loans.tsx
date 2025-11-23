import { type FormEvent, useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api/client';
import type { Loan, Book, User } from '../api/client';
import Modal from '../pages/Modal'; 
import '../CSS/Loans.css';

type LoanStatus = 'active' | 'overdue' | 'returned';

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'returned'>('active');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Formulario
  const [form, setForm] = useState({ userId: '', bookId: '', dueDate: '' });

  // Cargar datos iniciales
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
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const getBookTitle = (id: string) => books.find(b => b.id === id)?.title || 'Desconocido';
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Desconocido';

  const filteredLoans = loans.filter(l => {
    if (filter === 'all') return true;
    if (filter === 'returned') return l.status === 'returned';
    return l.status === 'active' || l.status === 'overdue';
  });

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      // CORRECCIÓN DE FECHA
      const datePayload = form.dueDate && form.dueDate !== '' ? new Date(form.dueDate) : undefined;
      
      await apiPost<Loan>('/loans', { ...form, dueDate: datePayload });
      setIsModalOpen(false);
      setForm({ userId: '', bookId: '', dueDate: '' });
      loadData();
    } catch (error) {
      alert('Error: Libro no disponible o usuario con tope de préstamos.');
    }
  }

  async function onReturn(id: string) {
    if(!confirm('¿Confirmar devolución?')) return;
    await apiPost(`/loans/${id}/return`);
    loadData();
  }

  async function onRenew(id: string) {
    try {
      await apiPost(`/loans/${id}/renew`);
      loadData();
    } catch (error) {
      alert('No se puede renovar este préstamo.');
    }
  }

  // ... Helpers de formato ...
  const getStatusClass = (l: Loan) => {
      if (l.status === 'returned') return 'loan-returned';
      return new Date(l.dueDate) < new Date() ? 'loan-overdue' : 'loan-active';
  };

  return (
    <div className="loans-container">
      <div className="loans-header">
        <h2>Préstamos</h2>
        <div className="loans-filter">
          <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Activos</button>
          <button className={`filter-btn ${filter === 'returned' ? 'active' : ''}`} onClick={() => setFilter('returned')}>Historial</button>
        </div>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>+ Nuevo Préstamo</button>
      </div>

      <div className="loans-grid">
        {filteredLoans.map((l) => (
          <div key={l.id} className={`loan-ticket ${getStatusClass(l)}`}>
            <div className="ticket-status-bar"></div>
            <div className="ticket-content">
              <div className="ticket-header">
                <span className="ticket-id">#{l.id.slice(0,6)}</span>
                <span className="status-badge">{l.status}</span>
              </div>
              <h3 className="book-title">{getBookTitle(l.bookId)}</h3>
              <div className="borrower-name">👤 {getUserName(l.userId)}</div>
              
              {l.status !== 'returned' && (
                  <div className="ticket-actions">
                    <button className="btn-action btn-return" onClick={() => onReturn(l.id)}>Devolver</button>
                    <button className="btn-action btn-renew" onClick={() => onRenew(l.id)}>Renovar</button>
                  </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Préstamo">
        <form onSubmit={onCreate}>
          <div className="form-group">
            <label>Usuario</label>
            {/* AQUI ESTA LA CLAVE: UN SELECTOR, NO UN INPUT DE TEXTO */}
            <select 
              className="form-input"
              value={form.userId}
              onChange={(e) => setForm({...form, userId: e.target.value})}
              required
            >
              <option value="">Seleccionar usuario...</option>
              {users.filter(u => u.isActive).map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Libro</label>
            {/* AQUI TAMBIEN: SELECTOR DE LIBROS DISPONIBLES */}
            <select 
              className="form-input"
              value={form.bookId}
              onChange={(e) => setForm({...form, bookId: e.target.value})}
              required
            >
              <option value="">Seleccionar libro...</option>
              {books.filter(b => b.available).map(b => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Vencimiento (Opcional)</label>
            <input type="date" className="form-input" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-primary">Crear</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}