import { Link, Route, Routes } from 'react-router-dom';
import { useState } from 'react'; // Importar useState
import './App.css';
import Home from './pages/Home';
import Books from './pages/Books';
import Users from './pages/Users';
import Loans from './pages/Loans';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import WelcomeScreen from './pages/WelcomeScreen'; // Importar el componente

function App() {
  // Estado para controlar si mostramos la bienvenida
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      {/* Si showWelcome es true, mostramos la animación */}
      {showWelcome && (
        <WelcomeScreen onComplete={() => setShowWelcome(false)} />
      )}

      {/* El contenido principal está presente pero oculto detrás, 
          o podrías usar una animación de entrada para el contenido también */}
      <div 
        style={{ 
          maxWidth: 1000, 
          margin: '0 auto', 
          padding: 16,
          // Hacemos que el contenido aparezca suavemente cuando se va el splash
          opacity: showWelcome ? 0 : 1,
          transition: 'opacity 1s ease-in-out',
          filter: showWelcome ? 'blur(5px)' : 'blur(0)',
        }}
      >
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
    </>
  );
}

export default App;