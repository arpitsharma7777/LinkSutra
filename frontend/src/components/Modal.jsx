import React, { createContext, useContext, useState, useEffect } from 'react';
import '../styles/Modal.css';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  const showConfirmModal = (options) => {
    return new Promise((resolve) => {
      setModal({
        type: 'confirm',
        title: options.title || 'Confirm Action',
        message: options.message || 'Are you sure you want to continue?',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        confirmButtonType: options.confirmButtonType || 'primary',
        onConfirm: () => {
          setModal(null);
          resolve(true);
        },
        onCancel: () => {
          setModal(null);
          resolve(false);
        }
      });
    });
  };

  const hideModal = () => {
    setModal(null);
  };

  return (
    <ModalContext.Provider
      value={{
        showConfirmModal,
        hideModal
      }}
    >
      {children}
      {modal && <Modal modal={modal} />}
    </ModalContext.Provider>
  );
}

function Modal({ modal }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      modal.onCancel();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(modal.onCancel, 200);
  };

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(modal.onConfirm, 200);
  };

  return (
    <div
      className={`modal-backdrop ${isVisible ? 'modal-visible' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{modal.title}</h3>
          <button
            className="modal-close"
            onClick={handleClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-message">{modal.message}</p>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={handleClose}
          >
            {modal.cancelText}
          </button>
          <button
            className={`btn btn-${modal.confirmButtonType === 'danger' ? 'danger' : 'primary'}`}
            onClick={handleConfirm}
          >
            {modal.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}