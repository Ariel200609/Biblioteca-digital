import { FormEvent, useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '../api/client';
import type { User } from '../api/client';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<{ name: string; email: string; role: User['role'] }>({ name: '', email: '', role: 'READER' });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const data = await apiGet<User[]>('/users');
    setUsers(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await apiPut<User>(`/users/${editingId}`, form);
      setEditingId(null);
    } else {
      await apiPost<User>('/users', form);
    }
    setForm({ name: '', email: '', role: 'READER' });
    await load();
  }

  async function onDelete(id: string) {
    await apiDelete(`/users/${id}`);
    await load();
  }

  return (
    <div>
      <h2>Usuarios</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 500 }}>
        <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })}>
          <option value="ADMIN">ADMIN</option>
          <option value="LIBRARIAN">LIBRARIAN</option>
          <option value="READER">READER</option>
        </select>
        <button type="submit">{editingId ? 'Guardar cambios' : 'Crear usuario'}</button>
      </form>

      <ul style={{ marginTop: 16 }}>
        {users.map((u) => (
          <li key={u.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>
              {u.name} — {u.email} — {u.role} {u.isActive === false ? '(inactivo)' : ''}
            </span>
            <button onClick={() => { setEditingId(u.id); setForm({ name: u.name, email: u.email, role: u.role }); }}>Editar</button>
            <button onClick={() => onDelete(u.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


