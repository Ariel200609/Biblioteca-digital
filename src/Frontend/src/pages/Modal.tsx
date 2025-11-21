import type { ReactNode } from 'react';
import '../CSS/Modal.css';

    interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    }

    export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
            <h2>{title}</h2>
            <button className="close-button" onClick={onClose}>&times;</button>
            </div>
            <div className="modal-body">
            {children}
            </div>
        </div>
        </div>
    );
    }