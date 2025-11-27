import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api/client';
import '../CSS/Notifications.css';

type NotificationItem = {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt?: string;
  timestamp?: string;
};

export default function Notifications() {
  const [userId, setUserId] = useState('');
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await apiGet<NotificationItem[]>(`/notifications/user/${userId}`);
      setItems(data.reverse());
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  // Cargar al presionar Enter o perder foco
  useEffect(() => {
    load();
  }, [userId]);

  async function markAll() {
    if (!userId) return;
    await apiPost(`/notifications/user/${userId}/read-all`);
    load();
  }

  async function markOne(notificationId: string) {
    if (!userId) return;
    await apiPost(`/notifications/user/${userId}/${notificationId}/read`);
    setItems(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'LOAN_OVERDUE': return '⚠️';
      case 'LOAN_DUE': return '⏰';
      case 'LOAN_RETURNED': return '✅';
      case 'LOAN_CREATED': return '📘';
      default: return '📢';
    }
  };

  const getTitle = (type: string) => {
    switch (type) {
      case 'LOAN_OVERDUE': return 'Préstamo Vencido';
      case 'LOAN_DUE': return 'Próximo Vencimiento';
      case 'LOAN_RETURNED': return 'Devolución Exitosa';
      case 'LOAN_CREATED': return 'Nuevo Préstamo';
      default: return 'Notificación del Sistema';
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Centro de Mensajes</h2>
        <div className="header-controls">
          <input 
            className="user-input"
            placeholder="ID de Usuario..." 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
          />
          <button className="add-btn" onClick={markAll} disabled={!userId}>
            Marcar todo leído
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{textAlign:'center', padding:'2rem'}}>Cargando...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>Sin notificaciones</h3>
          <p>Ingresa un ID de usuario válido o espera a tener actividad.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {items.map((n) => (
            <div 
              key={n.id} 
              className={`notification-card type-${n.type} ${n.read ? 'notification-read' : 'notification-unread'}`}
            >
              <div className="notification-content">
                <div className="notification-icon">{getIcon(n.type)}</div>
                <div className="notification-text">
                  <h4>{getTitle(n.type)}</h4>
                  <p>{n.message}</p>
                  <div className="notification-meta">
                    <span>{n.type}</span>
                    {n.createdAt && <span>• {new Date(n.createdAt).toLocaleString()}</span>}
                  </div>
                </div>
              </div>
              
              {!n.read && (
                <button 
                  className="mark-read-btn" 
                  onClick={() => markOne(n.id)}
                  title="Marcar como leída"
                >
                  Marcar leída
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}