import React from 'react';
import './Modal.css';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
      {children}
    </div>
  </div>
);

export default Modal;
