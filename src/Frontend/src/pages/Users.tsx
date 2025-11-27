import { type FormEvent, useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '../api/client';
import type { User } from '../api/client';
import Modal from '../pages/Modal'; // Reutilizamos tu modal
import '../CSS/Users.css';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Estado del Modal y Formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<{ name: string; email: string; role: User['role'] }>({ 
    name: '', 
    email: '', 
    role: 'reader' 
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Cargar usuarios
  async function load() {
    setLoading(true);
    try {
      const data = await apiGet<User[]>('/users');
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Filtrado en tiempo real
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = users.filter(u => 
        u.name.toLowerCase().includes(lowerTerm) || 
        u.email.toLowerCase().includes(lowerTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Manejo del Formulario
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await apiPut<User>(`/users/${editingId}`, form);
      } else {
        await apiPost<User>('/users', form);
      }
      setIsModalOpen(false);
      load();
    } catch (error) {
      alert('Error al guardar el usuario');
    }
  }

  async function onDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    await apiDelete(`/users/${id}`);
    load();
  }

  function openModal(user?: User) {
    if (user) {
      setEditingId(user.id);
      setForm({ name: user.name, email: user.email, role: user.role });
    } else {
      setEditingId(null);
      setForm({ name: '', email: '', role: 'reader' });
    }
    setIsModalOpen(true);
  }

  // Utilidad para obtener iniciales
    const getInitials = (name: string) => {  
    if (!name) return '??';
    
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Utilidad para nombres de roles amigables
  const getRoleName = (role: string) => {
    const roles = {
      ADMIN: 'Administrador',
      LIBRARIAN: 'Bibliotecario',
      READER: 'Lector'
    };
    return roles[role as keyof typeof roles] || role;
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>Gestión de Usuarios</h2>
        
        <div className="users-search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar por nombre o email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="add-btn" onClick={() => openModal()}>
          <span>+</span> Nuevo Usuario
        </button>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', color: '#666'}}>Cargando usuarios...</div>
      ) : (
        <div className="users-grid">
          {filteredUsers.map((u) => (
            <div key={u.id} className="user-card">
              {/* Indicador de Estado */}
              <div 
                className={`user-status ${u.isActive !== false ? 'status-active' : 'status-inactive'}`} 
                title={u.isActive !== false ? 'Activo' : 'Inactivo'}
              />

              {/* Avatar */}
              <div className="user-avatar">
                {getInitials(u.name)}
              </div>

              {/* Badge de Rol */}
              <div className={`role-badge role-${u.role.toLowerCase()}`}>
                {getRoleName(u.role)}
              </div>

              {/* Información Principal */}
              <h3 className="user-name">{u.name}</h3>
              <p className="user-email">{u.email}</p>

              {/* Acciones */}
              <div className="card-actions">
                <button className="btn-edit" onClick={() => openModal(u)}>
                  Editar
                </button>
                <button className="btn-delete" onClick={() => onDelete(u.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Creación/Edición */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Editar Usuario" : "Registrar Usuario"}
      >
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input 
              className="form-input" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              required 
              placeholder="Ej. Juan Pérez"
            />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email"
              className="form-input" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              required 
              placeholder="juan@ejemplo.com"
            />
          </div>
          <div className="form-group">
            <label>Rol de Usuario</label>
            <select 
              className="form-input" 
              value={form.role} 
              onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })}
            >
              <option value="READER">Lector (Estándar)</option>
              <option value="LIBRARIAN">Bibliotecario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {editingId ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}