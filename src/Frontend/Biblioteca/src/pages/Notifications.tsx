import { useState } from 'react';
import { apiGet, apiPost } from '../api/client';

type NotificationItem = {
  id: string;
  userId: string;
  type: string;
  message: string;
  isRead?: boolean;
  timestamp?: string;
};

export default function Notifications() {
  const [userId, setUserId] = useState('');
  const [items, setItems] = useState<NotificationItem[]>([]);

  async function load() {
    if (!userId) return;
    const data = await apiGet<NotificationItem[]>(`/notifications/user/${userId}`);
    setItems(data);
  }

  async function markAll() {
    if (!userId) return;
    await apiPost(`/notifications/user/${userId}/read-all`);
    await load();
  }

  async function markOne(notificationId: string) {
    if (!userId) return;
    await apiPost(`/notifications/user/${userId}/${notificationId}/read`);
    await load();
  }

  return (
    <div>
      <h2>Notificaciones</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <button onClick={load}>Cargar</button>
        <button onClick={markAll}>Marcar todas como leídas</button>
      </div>
      <ul style={{ marginTop: 16 }}>
        {items.map((n) => (
          <li key={n.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>
              [{n.type}] {n.message} {n.isRead ? '✔️' : ''}
            </span>
            {!n.isRead && <button onClick={() => markOne(n.id)}>Marcar leída</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}


