import { type FormEvent, useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '../api/client';
import type { Book } from '../api/client';
import Modal from '../pages/Modal';
import '../CSS/Books.css';

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'author' | 'category' | 'popularity'>('title');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Formulario
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Cargar libros (o buscar si hay query)
  async function loadBooks(query?: string, type: string = 'title') {
    setLoading(true);
    try {
      let endpoint = '/books';
      if (query) {
        // Usamos el endpoint de búsqueda del backend con tipo
        endpoint = `/books/search?query=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`;
      }
      const data = await apiGet<Book[]>(endpoint);
      setBooks(data);
    } catch (error) {
      console.error("Error cargando libros:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Debounce para la búsqueda
    const timeoutId = setTimeout(() => {
      loadBooks(searchQuery, searchType);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchType]);

  function openModal(book?: Book) {
    if (book) {
      setEditingId(book.id);
      setForm({ title: book.title, author: book.author, isbn: book.isbn, category: book.category });
    } else {
      setEditingId(null);
      setForm({ title: '', author: '', isbn: '', category: '' });
    }
    setIsModalOpen(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await apiPut<Book>(`/books/${editingId}`, form);
      } else {
        await apiPost<Book>('/books', form);
      }
      setIsModalOpen(false);
      loadBooks(searchQuery, searchType);
    } catch (error) {
      alert('Error al guardar el libro');
    }
  }

  async function onDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este libro?')) return;
    await apiDelete(`/books/${id}`);
    loadBooks(searchQuery, searchType);
  }

  return (
    <div className="books-container">
      <div className="books-header">
        <h2>Catálogo de Libros</h2>
        
        <div className="search-bar-container">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar por título, autor..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="search-type-select"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
          >
            <option value="title">Título</option>
            <option value="author">Autor</option>
            <option value="category">Categoría</option>
            <option value="popularity">Popularidad</option>
          </select>
        </div>

        <button className="add-btn" onClick={() => openModal()}>
          <span>+</span> Nuevo Libro
        </button>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', color: '#666'}}>Cargando catálogo...</div>
      ) : (
        <div className="books-grid">
          {books.map((b) => (
            <div key={b.id} className="book-card">
              <div className="book-cover-placeholder">
                <div className="book-category-badge">{b.category}</div>
                {/* Icono de libro grande */}
                <svg className="book-icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              
              <div className="book-info">
                <h3 className="book-title">{b.title}</h3>
                <p className="book-author">{b.author}</p>
                
                <div className="book-footer">
                  <div className={`status-indicator ${b.available !== false ? 'available' : 'loaned'}`}>
                    <div className={`status-dot ${b.available !== false ? 'status-available' : 'status-loaned'}`}></div>
                    <span>{b.available !== false ? 'Disponible' : 'Prestado'}</span>
                  </div>

                  <div className="book-actions">
                    <button className="icon-btn" onClick={() => openModal(b)} title="Editar">
                      ✎
                    </button>
                    <button className="icon-btn delete" onClick={() => onDelete(b.id)} title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Crear/Editar */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Editar Libro" : "Añadir Nuevo Libro"}
      >
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Autor</label>
            <input className="form-input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>ISBN</label>
            <input className="form-input" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select 
              className="form-input" 
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })} 
              required
            >
              <option value="">Seleccionar...</option>
              <option value="Novela">Novela</option>
              <option value="Ciencia Ficción">Ciencia Ficción</option>
              <option value="Historia">Historia</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Infantil">Infantil</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}