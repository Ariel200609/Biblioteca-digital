import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Books from './pages/Books';
import Users from './pages/Users';
import Loans from './pages/Loans';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';

function App() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <Link to="/">Inicio</Link>
        <Link to="/books">Libros</Link>
        <Link to="/users">Usuarios</Link>
        <Link to="/loans">Préstamos</Link>
        <Link to="/reports">Reportes</Link>
        <Link to="/notifications">Notificaciones</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/users" element={<Users />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </div>
  );
}

export default App;
