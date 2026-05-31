import React, { useEffect } from 'react';

export default function Snackbar({ message, isOpen, onClose, type = "success" }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div style={{
      position: 'fixed',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: isSuccess ? '#059669' : '#dc2626',
      color: 'white',
      padding: '14px 28px',
      borderRadius: '20px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontWeight: '700',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      animation: 'slideUpBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <style>
        {`
          @keyframes slideUpBounce {
            from { transform: translate(-50%, 100px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
        `}
      </style>
      <span style={{ fontSize: '20px' }}>{isSuccess ? '✅' : '⚠️'}</span>
      <span style={{ fontSize: '14px', letterSpacing: '0.3px', flex: 1 }}>{message}</span>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '4px',
          marginLeft: '4px',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.6,
          transition: 'opacity 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = 1}
        onMouseOut={(e) => e.currentTarget.style.opacity = 0.6}
      >
        <i className="fa fa-times"></i>
      </button>
    </div>
  );
}