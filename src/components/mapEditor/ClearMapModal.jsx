import React from 'react';

export default function ClearMapModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ fontSize: '40px', marginBottom: '16px', textAlign: 'center' }}>🗑️</div>
        <h3 style={{ margin: '0 0 8px', textAlign: 'center' }}>Hapus Desain?</h3>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24, textAlign: 'center' }}>Semua objek dan tekstur yang sudah diletakkan akan dihapus dari kanvas. Tindakan ini tidak dapat dibatalkan.</p>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={cancelButtonStyle}>Batal</button>
          <button onClick={() => { onConfirm(); onClose(); }} style={deleteButtonStyle}>Reset Sekarang</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' };
const modalStyle = { background: 'white', padding: 32, borderRadius: 24, width: 320, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', fontFamily: 'Inter, sans-serif' };
const cancelButtonStyle = { flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #cbd5e1', background: 'white', fontWeight: 600, cursor: 'pointer' };
const deleteButtonStyle = { flex: 2, padding: '12px', borderRadius: 12, border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer' };