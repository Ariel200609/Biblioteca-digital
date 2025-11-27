import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Books from './pages/Books';
import Users from './pages/Users';
import Loans from './pages/Loans';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import WelcomeScreen from './pages/WelcomeScreen';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      {showWelcome && (
        <WelcomeScreen onComplete={() => setShowWelcome(false)} />
      )}

      <div 
        style={{ 
          opacity: showWelcome ? 0 : 1,
          transition: 'opacity 1s ease-in-out',
          filter: showWelcome ? 'blur(5px)' : 'blur(0)',
          minHeight: '100vh',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Navbar />

        {/* Main Container */}
        <main style={{ 
          flex: 1,
          paddingTop: '70px',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center'
        }}>
          {/* Contenedor interno con ancho máximo controlado pero ancho base 100% */}
          <div style={{ 
            width: '100%', 
            maxWidth: '1200px', 
            padding: '20px', 
            boxSizing: 'border-box' 
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/users" element={<Users />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;