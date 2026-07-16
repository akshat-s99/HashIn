import React, { createContext, useContext, useState, useCallback } from 'react';
import { CiCircleInfo, CiCircleCheck, CiWarning, CiCircleRemove } from 'react-icons/ci';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => {
          let bgColor = 'var(--bg-card)';
          let borderColor = 'var(--color-border)';
          let iconColor = 'var(--color-text-main)';
          let icon = null;

          if (toast.type === 'error') {
            borderColor = 'var(--color-danger)';
            iconColor = 'var(--color-danger)';
            icon = <CiWarning size={20} />;
          } else if (toast.type === 'success') {
            borderColor = 'var(--color-success)';
            iconColor = 'var(--color-success)';
            icon = <CiCircleCheck size={20} />;
          } else {
            icon = <CiCircleInfo size={20} />;
          }

          return (
            <div 
              key={toast.id}
              style={{
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                padding: '12px 16px',
                boxShadow: 'var(--shadow-lg)',
                color: 'var(--color-text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                fontWeight: 500,
                minWidth: '250px',
                maxWidth: '400px',
                pointerEvents: 'auto',
                animation: 'slideIn 0.3s ease-out forwards',
              }}
            >
              <div style={{ color: iconColor, display: 'flex', alignItems: 'center' }}>
                {icon}
              </div>
              <div style={{ flex: 1 }}>{toast.message}</div>
              <button 
                onClick={() => removeToast(toast.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--color-text-muted)', 
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CiCircleRemove size={16} />
              </button>
            </div>
          );
        })}
      </div>
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
