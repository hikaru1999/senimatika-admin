import React from 'react';

export default function NewMapModal({ isOpen, onClose, onConfirm, width, height, setWidth, setHeight }) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ margin: '0 0 8px' }}>Membuat Peta Baru</h3>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>Tentukan dimensi area workspace peta.<br/>(Default: 40 tile x 30 tile)</p>
        
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Panjang (X tile)</label>
            <input 
              type="number" 
              value={width} 
              onChange={e => setWidth(e.target.value)} 
              style={inputStyle} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Lebar (Y tile)</label>
            <input 
              type="number" 
              value={height} 
              onChange={e => setHeight(e.target.value)} 
              style={inputStyle} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={cancelButtonStyle}>Batal</button>
          <button onClick={onConfirm} style={confirmButtonStyle}>Buat Kanvas</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' };
const modalStyle = { background: 'white', padding: 32, borderRadius: 24, width: 350, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', fontFamily: 'Inter, sans-serif' };
const labelStyle = { fontSize: 12, fontWeight: 800, color: '#475569' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #cbd5e1', marginTop: 6, fontSize: 16, boxSizing: 'border-box' };
const cancelButtonStyle = { flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #cbd5e1', background: 'white', fontWeight: 600, cursor: 'pointer' };
const confirmButtonStyle = { flex: 2, padding: '12px', borderRadius: 12, border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer' };