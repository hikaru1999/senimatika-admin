import React from 'react';

export default function SaveMapModal({ isOpen, onClose, onConfirm, isSaving }) {
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
            margin-right: 10px;
          }
        `}
      </style>
      <div style={modalStyle}>
        <div style={{ fontSize: '40px', marginBottom: '16px', textAlign: 'center' }}>💾</div>
        <h3 style={{ margin: '0 0 8px', textAlign: 'center' }}>Simpan Perubahan?</h3>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24, textAlign: 'center' }}>Apakah Anda ingin menyimpan progres desain peta Anda ke database server?</p>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={cancelButtonStyle} disabled={isSaving}>Batal</button>
          <button onClick={onConfirm} style={confirmButtonStyle} disabled={isSaving}>
            {isSaving ? <><div className="spinner"></div> Proses...</> : "Simpan Map"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' };
const modalStyle = { background: 'white', padding: 32, borderRadius: 32, width: 320, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', fontFamily: 'Inter, sans-serif' };
const cancelButtonStyle = { flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #cbd5e1', background: 'white', fontWeight: 600, cursor: 'pointer' };
const confirmButtonStyle = { flex: 2, padding: '12px', borderRadius: 12, border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };