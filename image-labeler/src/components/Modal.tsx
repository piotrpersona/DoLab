import React from 'react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    onClose: () => void;
    variant?: 'error' | 'info' | 'success' | 'warning';
    children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, onClose, variant = 'info', children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className={`modal ${variant}`}>
                <div className="modal-header">
                    <h4 id="modal-title" className="modal-title">{title}</h4>
                    <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
                </div>
                <div className="modal-body">
                    {message && <p className="modal-message">{message}</p>}
                    {children}
                </div>
                <div className="modal-actions">
                    <button className="modal-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;

