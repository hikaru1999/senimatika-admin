import React from 'react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isLoading, title = "Hapus Konten?", description = "Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus data ini dari database?" }) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spinner {
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid #ffffff;
            border-radius: 50%;
            width: 14px;
            height: 14px;
            animation: spin 0.8s linear infinite;
            display: inline-block;
          }
        `}
      </style>
      <div style={modalStyle}>
        <div style={{ fontSize: '40px', marginBottom: '16px', textAlign: 'center' }}>🗑️</div>
        <h3 style={{ margin: '0 0 8px', textAlign: 'center', color: '#1e293b' }}>{title}</h3>
        <div style={{ color: '#64748b', fontSize: 13, marginBottom: 24, textAlign: 'center', lineHeight: '1.5' }}>
          {description}
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={cancelButtonStyle} disabled={isLoading}>Batal</button>
          <button onClick={onConfirm} style={confirmButtonStyle(isLoading)} disabled={isLoading}>
            {isLoading ? <><div className="spinner"></div> Menghapus...</> : "Hapus Permanen"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = { 
  position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', 
  zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', 
  backdropFilter: 'blur(4px)' 
};

const modalStyle = { 
  background: 'white', padding: 32, borderRadius: 32, width: 340, 
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', fontFamily: 'Inter, sans-serif' 
};

const cancelButtonStyle = { 
  flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #cbd5e1', 
  background: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' 
};

const confirmButtonStyle = (loading) => ({ 
  flex: 1.5, padding: '12px', borderRadius: 12, border: 'none', 
  background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  opacity: loading ? 0.7 : 1
});