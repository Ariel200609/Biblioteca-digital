import { useEffect, useState } from 'react';
import '../CSS/WelcomeScreen.css';

interface WelcomeScreenProps {
onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Tiempo total de la animación antes de empezar a desaparecer
        const timer = setTimeout(() => {
        setFadeOut(true);
        }, 2500); // 2.5 segundos en pantalla

        // Tiempo que tarda la animación de salida (coincide con CSS)
        const removeTimer = setTimeout(() => {
        onComplete();
        }, 3500); // 2.5s + 1s de fade out

        return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
        };
    }, [onComplete]);

    return (
        <div className={`welcome-container ${fadeOut ? 'fade-out' : ''}`}>
        <div className="content-wrapper">
            <div className="logo-animation">
            {/* Icono de libro animado con SVG */}
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="book-icon"
            >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            </div>
            
            <div className="text-container">
            <h1 className="title">Biblioteca <span className="highlight">Digital</span></h1>
            <div className="loading-line"></div>
            <p className="subtitle">Gestionando el conocimiento</p>
            </div>
        </div>
        </div>
    );
}