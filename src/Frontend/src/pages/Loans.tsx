import { FormEvent, useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api/client';
import type { Loan, LoanWithDetails } from '../api/client';

export default function Loans() {
  const [loans, setLoans] = useState<Loan[] | LoanWithDetails[]>([]);
  const [form, setForm] = useState<{ userId: string; bookId: string; dueDate: string }>({ userId: '', bookId: '', dueDate: '' });

  async function load() {
    const data = await apiGet<Loan[]>('/loans');
    setLoans(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    const payload = { userId: form.userId, bookId: form.bookId, dueDate: new Date(form.dueDate) };
    await apiPost<Loan>('/loans', payload);
    setForm({ userId: '', bookId: '', dueDate: '' });
    await load();
  }

  async function onReturn(id: string) {
    await apiPost<Loan>(`/loans/${id}/return`);
    await load();
  }

  async function onRenew(id: string) {
    await apiPost<Loan>(`/loans/${id}/renew`);
    await load();
  }

  return (
    <div>
      <h2>Préstamos</h2>
      <form onSubmit={onCreate} style={{ display: 'grid', gap: 8, maxWidth: 500 }}>
        <input placeholder="User ID" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required />
        <input placeholder="Book ID" value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })} required />
        <input type="date" placeholder="Fecha de devolución" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
        <button type="submit">Crear préstamo</button>
      </form>

      <ul style={{ marginTop: 16 }}>
        {loans.map((l) => (
          <li key={l.id} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span>
              {l.id} — usuario {l.userId} — libro {l.bookId} — vence {new Date(l.dueDate).toLocaleDateString()} — estado {l.status}
            </span>
            <button onClick={() => onReturn(l.id)}>Devolver</button>
            <button onClick={() => onRenew(l.id)}>Renovar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


