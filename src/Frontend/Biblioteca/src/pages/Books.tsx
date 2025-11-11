import { FormEvent, useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '../api/client';
import type { Book } from '../api/client';

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const data = await apiGet<Book[]>('/books');
    setBooks(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await apiPut<Book>(`/books/${editingId}`, form);
      setEditingId(null);
    } else {
      await apiPost<Book>('/books', form);
    }
    setForm({ title: '', author: '', isbn: '', category: '' });
    await load();
  }

  async function onDelete(id: string) {
    await apiDelete(`/books/${id}`);
    await load();
  }

  return (
    <div>
      <h2>Libros</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 500 }}>
        <input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Autor" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
        <input placeholder="ISBN" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} required />
        <input placeholder="Categoría" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <button type="submit">{editingId ? 'Guardar cambios' : 'Crear libro'}</button>
      </form>

      <ul style={{ marginTop: 16 }}>
        {books.map((b) => (
          <li key={b.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>
              {b.title} — {b.author} ({b.category}) {b.available === false ? '⛔ No disponible' : '✅ Disponible'}
            </span>
            <button onClick={() => { setEditingId(b.id); setForm({ title: b.title, author: b.author, isbn: b.isbn, category: b.category }); }}>Editar</button>
            <button onClick={() => onDelete(b.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


